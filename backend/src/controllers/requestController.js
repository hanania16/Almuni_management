import { Op, fn, col } from 'sequelize';
import { sequelize } from '../config/database.js';
import DocumentRequest from '../models/DocumentRequest.js';
import AttachedDocument from '../models/AttachedDocument.js';
import Payment from '../models/Payment.js';
import Person from '../models/Person.js';
import User from '../models/User.js';
import { generateTrackingNumber, generateReceiptNumber } from '../middleware/auth.js';

// @desc    Create new document request
// @route   POST /api/requests
// @access  Private
export const createRequest = async (req, res) => {
  try {
    const {
      documentType,
      // Personal info
      firstName,
      fatherName,
      grandfatherName,
      idNo,
      mobileNumber,
      email,
      // Academic info
      admissionType,
      degreeType,
      college,
      department,
      otherCollege,
      otherCollegeText,
      otherDepartment,
      otherDepartmentText,
      studentStatus,
      // Order info
      orderType,
      sendWithinBITS,
      institutionName,
      institutionAddress,
      mailingAgent,
      country,
      // Original Degree specific
      firstNameAmharic,
      fatherNameAmharic,
      grandfatherNameAmharic,
      yearOfGraduationEC,
      yearOfGraduationGC,
      serviceType,
      // Student Copy specific
      programType,
      yearOfStudy,
      semester,
      // Supporting Letter specific
      organizationName,
      purpose,
      letterContent,
      authorizedPerson,
      authorizedPhone,
      authorizedEmail,
      authorizedAddress,
    } = req.body;

    // Get user info if logged in
    let personId = null;
    if (req.user && req.user.role === 'student') {
      const person = await Person.findOne({ where: { email: req.user.email } });
      if (person) {
        personId = person.id;
      }
    }

    // Generate tracking number
    const trackingNumber = generateTrackingNumber();

    // Create request
    const request = await DocumentRequest.create({
      trackingNumber,
      personId,
      documentType,
      // Personal info
      firstName,
      fatherName,
      grandfatherName,
      idNo,
      mobileNumber,
      email,
      // Academic info
      admissionType,
      degreeType,
      college,
      department,
      otherCollege,
      otherCollegeText,
      otherDepartment,
      otherDepartmentText,
      studentStatus,
      // Order info
      orderType,
      sendWithinBITS,
      institutionName,
      institutionAddress,
      mailingAgent,
      country,
      // Original Degree specific
      firstNameAmharic,
      fatherNameAmharic,
      grandfatherNameAmharic,
      yearOfGraduationEC,
      yearOfGraduationGC,
      serviceType,
      // Student Copy specific
      programType,
      yearOfStudy,
      semester,
      // Supporting Letter specific
      organizationName,
      purpose,
      letterContent,
      authorizedPerson,
      authorizedPhone,
      authorizedEmail,
      authorizedAddress,
    });

    // Handle file uploads
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        await AttachedDocument.create({
          documentRequestId: request.id,
          fileName: file.filename,
          originalName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          filePath: file.path,
          documentType: file.fieldname === 'costSharingLetter' ? 'Cost Sharing Letter' : 'Other Documents',
        });
      }
    }

    res.status(201).json({
      success: true,
      data: {
        id: request.id,
        trackingNumber: request.trackingNumber,
        status: request.requestStatus,
        documentType: request.documentType,
        submittedDate: request.requestDate,
      },
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating request',
      error: error.message,
    });
  }
};

// @desc    Get all requests (Admin)
// @route   GET /api/requests
// @access  Private/Admin
export const getAllRequests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      search,
      sortBy = 'requestDate',
      sortOrder = 'DESC',
    } = req.query;

    const where = {};

    // Apply filters
    if (status && status !== 'all') {
      where.requestStatus = status;
    }

    if (type && type !== 'all') {
      where.documentType = type;
    }

    if (search) {
      where[Op.or] = [
        { trackingNumber: { [Op.like]: `%${search}%` } },
        { firstName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { fatherName: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: requests } = await DocumentRequest.findAndCountAll({
      where,
      include: [
        {
          model: AttachedDocument,
          as: 'attachedDocuments',
          attributes: ['id', 'fileName', 'documentType'],
        },
        {
          model: Person,
          as: 'person',
          attributes: ['id', 'firstName', 'email', 'bitsId'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['bitsId'],
            },
          ],
        },
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
    });

    res.json({
      success: true,
      data: requests,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching requests',
      error: error.message,
    });
  }
};

// @desc    Get my requests (Student)
// @route   GET /api/requests/my
// @access  Private/Student
export const getMyRequests = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const where = { email: req.user.email };

    if (status && status !== 'all') {
      where.requestStatus = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows: requests } = await DocumentRequest.findAndCountAll({
      where,
      include: [
        {
          model: AttachedDocument,
          as: 'attachedDocuments',
          attributes: ['id', 'fileName', 'documentType'],
        },
      ],
      order: [['requestDate', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: requests,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your requests',
      error: error.message,
    });
  }
};

// @desc    Get request by ID
// @route   GET /api/requests/:id
// @access  Private
export const getRequestById = async (req, res) => {
  try {
    const request = await DocumentRequest.findByPk(req.params.id, {
      include: [
        {
          model: AttachedDocument,
          as: 'attachedDocuments',
        },
        {
          model: Payment,
          as: 'payment',
        },
        {
          model: Person,
          as: 'person',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['bitsId'],
            },
          ],
        },
      ],
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Check authorization
    const isOwner = request.email === req.user?.email;
    const isAdmin = req.user?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request',
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error('Get request by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching request',
      error: error.message,
    });
  }
};

// @desc    Track request by tracking number
// @route   GET /api/requests/track/:trackingNumber
// @access  Public
export const trackRequest = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const request = await DocumentRequest.findOne({
      where: { trackingNumber },
      attributes: [
        'id',
        'trackingNumber',
        'documentType',
        'requestStatus',
        'requestDate',
        'firstName',
        'fatherName',
        'email',
      ],
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    res.json({
      success: true,
      data: {
        trackingNumber: request.trackingNumber,
        documentType: request.documentType,
        status: request.requestStatus,
        submittedDate: request.requestDate,
        applicantName: `${request.firstName} ${request.fatherName || ''}`,
      },
    });
  } catch (error) {
    console.error('Track request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error tracking request',
      error: error.message,
    });
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private/Admin
export const updateRequestStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const { id } = req.params;

    const request = await DocumentRequest.findByPk(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Approved', 'Rejected', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    await request.update({ requestStatus: status });

    res.json({
      success: true,
      data: {
        id: request.id,
        trackingNumber: request.trackingNumber,
        status: request.requestStatus,
      },
    });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating request',
      error: error.message,
    });
  }
};

// @desc    Update full request
// @route   PUT /api/requests/:id
// @access  Private/Admin
export const updateRequest = async (req, res) => {
  try {
    const request = await DocumentRequest.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Update request fields
    await request.update(req.body);

    // Handle file uploads
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        await AttachedDocument.create({
          documentRequestId: request.id,
          fileName: file.filename,
          originalName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          filePath: file.path,
        });
      }
    }

    const updatedRequest = await DocumentRequest.findByPk(request.id, {
      include: [
        {
          model: AttachedDocument,
          as: 'attachedDocuments',
        },
      ],
    });

    res.json({
      success: true,
      data: updatedRequest,
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating request',
      error: error.message,
    });
  }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private/Admin
export const deleteRequest = async (req, res) => {
  try {
    const request = await DocumentRequest.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Delete associated attachments
    await AttachedDocument.destroy({
      where: { documentRequestId: request.id },
    });

    // Delete request
    await request.destroy();

    res.json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting request',
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/requests/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const total = await DocumentRequest.count();
    const pending = await DocumentRequest.count({ where: { requestStatus: 'Pending' } });
    const processing = await DocumentRequest.count({ where: { requestStatus: 'Processing' } });
    const completed = await DocumentRequest.count({ where: { requestStatus: 'Completed' } });
    const rejected = await DocumentRequest.count({ where: { requestStatus: 'Rejected' } });
    const approved = await DocumentRequest.count({ where: { requestStatus: 'Approved' } });

    // Get requests by type
    const byType = await DocumentRequest.findAll({
      attributes: [
        'documentType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['documentType'],
    });

    // Get recent requests
    const recent = await DocumentRequest.findAll({
      limit: 5,
      order: [['requestDate', 'DESC']],
      attributes: ['id', 'trackingNumber', 'documentType', 'requestStatus', 'requestDate', 'firstName', 'email'],
    });

    res.json({
      success: true,
      data: {
        total,
        pending,
        processing,
        completed,
        rejected,
        approved,
        byType: byType.map((item) => ({
          type: item.documentType,
          count: item.get('count'),
        })),
        recent,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics',
      error: error.message,
    });
  }
};

