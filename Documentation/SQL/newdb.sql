DROP DATABASE q1times_test;
CREATE DATABASE q1times_test;

USE q1times_test;

CREATE TABLE Surveys (
    SurveyID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(20) NOT NULL,
    `Description` VARCHAR(99),
    CutOffTime INT CHECK (CutOffTime > 0),
    `Limit` INT CHECK (`Limit` > 0),
    IsQuizMode BOOLEAN NOT NULL,
    CCode TEXT NOT NULL
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
    SessionKey TEXT NOT NULL,
    NickName VARCHAR(20) NOT NULL,
    FOREIGN KEY (SurveyID) REFERENCES Surveys(SurveyID)
);

-- INSERT INTO Surveys (SurveyId, Title, `Description`, CutOffTime, `Limit`, IsQuizMode)
-- VALUES 
--    (4, 'Тестирование 1', 'Описание для первого тестирования', 90, 20, true),
--    (2, 'Тестирование 2', 'Описание для второго тестирования', 120, 30, false),
--    (3, 'Тестирование 3', 'Описание для третьего тестирования', 60, 25, true);
