DROP DATABASE q1times_test;
CREATE DATABASE q1times_test;

USE q1times_test;

CREATE TABLE Surveys (
    SurveyID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(20) NOT NULL,
    Description VARCHAR(99),
    CutOffTime INT CHECK (CutOffTime > 0),
    `Limit` INT CHECK (`Limit` > 0),
    IsQuizMode BOOLEAN NOT NULL
);

CREATE TABLE Questions (
    QuestionID INT AUTO_INCREMENT PRIMARY KEY,
    SurveyID INT,
    QuestionText TEXT NOT NULL,
    MultiAnswer BOOLEAN NOT NULL,
    TrueAnswerIndex INT,
    FOREIGN KEY (SurveyID) REFERENCES Surveys(SurveyID)
);

CREATE TABLE Answers (
    AnswerID INT AUTO_INCREMENT PRIMARY KEY,
    QuestionID INT,
    AnswerText TEXT NOT NULL,
    FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID)
);

CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    SurveyID INT,
    SessionKey TEXT,
    FOREIGN KEY (SurveyID) REFERENCES Surveys(SurveyID)
);

DELIMITER $$

CREATE TRIGGER before_answer_insert
BEFORE INSERT ON Answers
FOR EACH ROW
BEGIN
    DECLARE total_answers INT;
    SELECT COUNT(*) INTO total_answers FROM Answers WHERE QuestionID = NEW.QuestionID;
    IF total_answers >= 10 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot insert more than 10 answers for a question';
    END IF;
END$$

CREATE TRIGGER before_question_insert
BEFORE INSERT ON Questions
FOR EACH ROW
BEGIN
    DECLARE total_questions INT;
    SELECT COUNT(*) INTO total_questions FROM Questions WHERE SurveyID = NEW.SurveyID;
    IF total_questions >= 20 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot insert more than 20 questions for a survey';
    END IF;
END$$

DELIMITER ;

-- Example data to verify the structure (optional)

INSERT INTO Surveys (Title, Description, CutOffTime, `Limit`, IsQuizMode)
VALUES ('Sample Survey', 'This is a sample survey description', 3600, 100, FALSE);

INSERT INTO Questions (SurveyID, QuestionText, MultiAnswer, TrueAnswerIndex)
VALUES (1, 'Sample Question 1', FALSE, NULL),
       (1, 'Sample Question 2', TRUE, 1);

INSERT INTO Answers (QuestionID, AnswerText)
VALUES (1, 'Sample Answer 1 for Question 1'),
       (1, 'Sample Answer 2 for Question 1'),
       (2, 'Sample Answer 1 for Question 2'),
       (2, 'Sample Answer 2 for Question 2');

