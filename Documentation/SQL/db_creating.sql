CREATE DATABASE IF NOT EXISTS Q1TIMES;
USE Q1TIMES;
CREATE TABLE IF NOT EXISTS Surveys(
	SurveyId INT NOT NULL AUTO_INCREMENT UNIQUE,
    Title VARCHAR (255) NOT NULL UNIQUE,
    SurPassword  VARCHAR (255) NULL,
    CutOffTime INT NULL,
    PeopleLimit INT NULL,
    SurveyStatus BOOL NOT NULL,
    PRIMARY KEY (SurveyId)
);

CREATE TABLE IF NOT EXISTS Users(
	UserId INT NOT NULL AUTO_INCREMENT UNIQUE,
    SessionKey VARCHAR (255) NOT NULL UNIQUE,
    Survey INT NULL,
    PRIMARY KEY (UserId),
    FOREIGN KEY (Survey) REFERENCES Surveys(SurveyId)
);

ALTER TABLE Surveys AUTO_INCREMENT = 3;
ALTER TABLE Users AUTO_INCREMENT = 3;