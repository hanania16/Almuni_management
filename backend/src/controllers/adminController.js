import { Sequelize } from 'sequelize';
import User from '../models/User.js';
import Person from '../models/Person.js';
import DocumentRequest from '../models/DocumentRequest.js';

const { Op, fn, col } = Sequelize;

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const totalRequests = await DocumentRequest.count();
    const pending = await DocumentRequest.count({ where: { requestStatus: 'Pending' } });
    const processing = await DocumentRequest.count({ where: { requestStatus: 'Processing' } });
    const completed = await DocumentRequest.count({ where: { requestStatus: 'Completed' } });
    const rejected = await DocumentRequest.count({ where: { requestStatus: 'Rejected' } });
    const approved = await DocumentRequest.count({ where: { requestStatus: 'Approved' } });

    const totalUsers = await User.count({ where: { role: 'student' } });
    const activeUsers = await User.count({ where: { role: 'student', isActive: true } });

    // Get requests by type
    const byType = await DocumentRequest.findAll({
      attributes: [
        'documentType',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['documentType'],
      raw: true,
    });

    // Get recent requests
    const recentRequests = await DocumentRequest.findAll({
      limit: 10,
      order: [['requestDate', 'DESC']],
      attributes: ['id', 'trackingNumber', 'documentType', 'requestStatus', 'requestDate', 'firstName', 'email'],
    });

    res.json({
      success: true,
      data: {
        requests: {
          total: totalRequests,
          pending,
          processing,
          completed,
          rejected,
          approved,
        },
        users: {
          total: totalUsers,
          active: activeUsers,
        },
        byType: byType.map((item) => ({
          type: item.documentType,
          count: item.count,
        })),
        recentRequests,
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching stats',
      error: error.message,
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;

    const where = { role: 'student' };

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    if (search) {
      where[Op.or] = [
        { email: { [Op.like]: `%${search}%` } },
        { name: { [Op.like]: `%${search}%` } },
        { bitsId: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: users,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users',
      error: error.message,
    });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, name } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (isActive !== undefined) {
      await user.update({ isActive });
    }

    if (name) {
      await user.update({ name });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user',
      error: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Soft delete - deactivate instead of hard delete
    await user.update({ isActive: false });

    res.json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user',
      error: error.message,
    });
  }
};

// @desc    Get all requests with filters
// @route   GET /api/admin/requests
// @access  Private/Admin
export const getAllRequests = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type, search, sortBy = 'requestDate', sortOrder = 'DESC' } = req.query;

    const where = {};

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
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: requests } = await DocumentRequest.findAndCountAll({
      where,
      include: [
        {
          model: Person,
          as: 'person',
          attributes: ['id', 'firstName', 'email'],
        },
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset,
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
    console.error('Get admin requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching requests',
      error: error.message,
    });
  }
};

// @desc    Update request status
// @route   PUT /api/admin/requests/:id
// @access  Private/Admin
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { requestStatus } = req.body;

    const request = await DocumentRequest.findByPk(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    const validStatuses = ['Pending', 'Processing', 'Approved', 'Rejected', 'Completed'];
    if (requestStatus && validStatuses.includes(requestStatus)) {
      await request.update({ requestStatus });
    }

    res.json({
      success: true,
      data: {
        id: request.id,
        trackingNumber: request.trackingNumber,
        requestStatus: request.requestStatus,
      },
    });
  } catch (error) {
    console.error('Update admin request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating request',
      error: error.message,
    });
  }
};

// @desc    Delete request
// @route   DELETE /api/admin/requests/:id
// @access  Private/Admin
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await DocumentRequest.findByPk(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    await request.destroy();

    res.json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error) {
    console.error('Delete admin request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting request',
      error: error.message,
    });
  }
};

