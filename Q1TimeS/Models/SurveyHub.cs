using Microsoft.AspNetCore.SignalR;
using Q1TimeS.Controllers;
using Q1TimeS.Models.Db;
using System.Collections;
using System.Collections.Concurrent;
using System.Threading.Tasks;

public class SurveyHub : Hub
{
    private static ConcurrentDictionary<string, int> _surveyConnections = new ConcurrentDictionary<string, int>();
    private readonly MySqlContext _dbcontext;

    public SurveyHub(MySqlContext dbcontext)
    {
        _dbcontext = dbcontext;
    }

    public async Task JoinSurvey(string code)
    {
        if (_surveyConnections.TryGetValue(code, out int currentCount))
        {
            var survey = GetSurveyByCode(code);
            if (currentCount >= survey.Limit)
            {
                await Clients.Caller.SendAsync("SurveyFull");
                return;
            }

            _surveyConnections[code] = currentCount + 1;
        }
        else
        {
            _surveyConnections[code] = 1;
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, code);
        await Clients.Group(code).SendAsync("UpdateUserCount", _surveyConnections[code]);
    }

    public async Task LeaveSurvey(string code)
    {
        if (_surveyConnections.TryGetValue(code, out int currentCount))
        {
            if (currentCount > 1)
                _surveyConnections[code] = currentCount - 1;
            else
                _surveyConnections.TryRemove(code, out _);
        }

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, code);
        await Clients.Group(code).SendAsync("UpdateUserCount", _surveyConnections.GetValueOrDefault(code, 0));
    }
    public static int GetUserCount(string code)
    {
        _surveyConnections.TryGetValue(code, out int userCount);
        return userCount;
    }

    private Survey GetSurveyByCode(string code)
    {
        Survey survey = _dbcontext.Surveys.FirstOrDefault(s => s.CCode == code);
        //if (survey == null)
        return survey;
    }
}
