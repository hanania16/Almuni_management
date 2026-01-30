

Alumni Management System
System supports students and alumni requesting academic documents.
 Multiple document types are handled directly in the DocumentRequest table.

CONCEPTUAL DATABASE DESIGN (ER MODEL)
This shows entities, attributes, and relationships, without SQL or data types.

🟦 ENTITY 1: PERSON (Student / Alumni)
Represents anyone who requests a document.
Attributes
PersonID (PK)


FirstName


FatherName


GrandFatherName (Optional)


IDNumber (Optional)


MobileNumber


Email


StudentStatus (Active, Inactive, Graduated)
DepartmentName (Software Engineering, Information Technology, IT Management)
AdmissionTypeName (Regular, Evening, Summer, Distance)
DegreeTypeName (Degree, Master’s)


GraduationYear


GraduationCalendar (EC, GC)



🟦 ENTITY 2: DOCUMENT_REQUEST
Central entity that connects everything. Represents a student/alumnus request for a document.
Attributes
RequestID (PK)


RequestDate


OrderType (Local, International, Legal Delegate)
InstitutionName


Country


InstitutionAddress


MailingAgent


RequestStatus (Pending, Approved, Rejected, Completed)


DocumentType (Official Transcript, Original Degree, Student Copy, Temporary Certificate, To Whom It May Concern, Document Authentication, Document Replacement)


PersonID (FK)



🟦 ENTITY 3: ATTACHED_DOCUMENT
For cost sharing letters and other uploaded documents associated with a request.
Attributes
AttachmentID (PK)


FileName


FileType


Description


RequestID (FK)



🟦 ENTITY 4: PAYMENT
Represents cost sharing and receipts for a document request.
Attributes
PaymentID (PK)


ReceiptNumber


PaymentDate


Amount


PaymentStatus


RequestID (FK)


✅ Notes for Report / Viva
ServiceType table has been removed; document type is now stored directly in DocumentRequest.


Relationships:


Person → DocumentRequest (1 : M)


DocumentRequest → AttachedDocument (1 : M)


DocumentRequest → Payment (1 : 1)





ALUMNI MANAGEMENT SYSTEM – SQL IMPLEMENTATION
1️⃣ PERSON (Student / Alumni)
CREATE TABLE Person (
    PersonID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL,
    FatherName VARCHAR(50) NOT NULL,
    GrandFatherName VARCHAR(50),
    IDNumber VARCHAR(30),
    MobileNumber VARCHAR(20),
    Email VARCHAR(100),
    StudentStatus VARCHAR(20),        -- Active, Inactive, Graduated
    DepartmentName VARCHAR(50),       -- Software Engineering, IT, IT Management
    AdmissionTypeName VARCHAR(50),    -- Regular, Evening, Summer, Distance
    DegreeTypeName VARCHAR(50),       -- Degree, Master’s
    GraduationYear INT,
    GraduationCalendar VARCHAR(5)     -- EC, GC
);



2️⃣ DOCUMENT_REQUEST
CREATE TABLE DocumentRequest (
    RequestID INT PRIMARY KEY AUTO_INCREMENT,
    RequestDate DATE,
    OrderType VARCHAR(30),             -- Local, International, Legal Delegate
    InstitutionName VARCHAR(150),
    Country VARCHAR(50),
    InstitutionAddress VARCHAR(200),
    MailingAgent VARCHAR(100),
    RequestStatus VARCHAR(30),         -- Pending, Approved, Rejected, Completed
    DocumentType VARCHAR(100),         -- Transcript, Degree, Temporary Certificate, etc.
    PersonID INT,
    FOREIGN KEY (PersonID) REFERENCES Person(PersonID)
);

3️⃣ ATTACHED_DOCUMENT
CREATE TABLE AttachedDocument (
    AttachmentID INT PRIMARY KEY AUTO_INCREMENT,
    FileName VARCHAR(150),
    FileType VARCHAR(50),
    Description VARCHAR(200),
    RequestID INT,
    FOREIGN KEY (RequestID) REFERENCES DocumentRequest(RequestID)
);

4️⃣ PAYMENT
CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY AUTO_INCREMENT,
    ReceiptNumber VARCHAR(50),
    PaymentDate DATE,
    Amount DECIMAL(10,2),
    PaymentStatus VARCHAR(30),        -- Paid, Pending, Rejected
    RequestID INT UNIQUE,
    FOREIGN KEY (RequestID) REFERENCES DocumentRequest(RequestID)
);

