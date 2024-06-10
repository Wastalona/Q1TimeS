CREATE DATABASE q1times_test;

USE q1times_test;

CREATE TABLE Survey (
    SurveyID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(20) NOT NULL,
    Description VARCHAR(99),
    CutOffTime INT CHECK (CutOffTime > 0),
    `Limit` INT CHECK (`Limit` > 0),
    IsQuizMode BOOLEAN NOT NULL
);

CREATE TABLE Question (
    QuestionID INT AUTO_INCREMENT PRIMARY KEY,
    SurveyID INT,
    QuestionText TEXT NOT NULL,
    MultiAnswer BOOLEAN NOT NULL,
    TrueAnswerIndex INT,
    FOREIGN KEY (SurveyID) REFERENCES Survey(SurveyID)
);

CREATE TABLE Answer (
    AnswerID INT AUTO_INCREMENT PRIMARY KEY,
    QuestionID INT,
    AnswerText TEXT NOT NULL,
    IsCorrect BOOLEAN NOT NULL,
    FOREIGN KEY (QuestionID) REFERENCES Question(QuestionID)
);

CREATE TABLE UserSurvey (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    SurveyID INT,
    SessionKey TEXT,
    FOREIGN KEY (SurveyID) REFERENCES Survey(SurveyID)
);

DELIMITER $$

CREATE TRIGGER before_answer_insert
BEFORE INSERT ON Answer
FOR EACH ROW
BEGIN
    DECLARE total_answers INT;
    SELECT COUNT(*) INTO total_answers FROM Answer WHERE QuestionID = NEW.QuestionID;
    IF total_answers >= 10 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot insert more than 10 answers for a question';
    END IF;
END$$

CREATE TRIGGER before_question_insert
BEFORE INSERT ON Question
FOR EACH ROW
BEGIN
    DECLARE total_questions INT;
    SELECT COUNT(*) INTO total_questions FROM Question WHERE SurveyID = NEW.SurveyID;
    IF total_questions >= 20 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot insert more than 20 questions for a survey';
    END IF;
END$$

DELIMITER ;

-- Example data to verify the structure (optional)

INSERT INTO Survey (Title, Description, CutOffTime, `Limit`, IsQuizMode)
VALUES ('Sample Survey', 'This is a sample survey description', 3600, 100, FALSE);

INSERT INTO Question (SurveyID, QuestionText, MultiAnswer, TrueAnswerIndex)
VALUES (1, 'Sample Question 1', FALSE, NULL),
       (1, 'Sample Question 2', TRUE, 1);

INSERT INTO Answer (QuestionID, AnswerText, IsCorrect)
VALUES (1, 'Sample Answer 1 for Question 1', FALSE),
       (1, 'Sample Answer 2 for Question 1', TRUE),
       (2, 'Sample Answer 1 for Question 2', FALSE),
       (2, 'Sample Answer 2 for Question 2', TRUE);

