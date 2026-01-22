import React, { useState, useEffect } from 'react';
import teamsData from './data/teams.json';
import './Inspection.css';

function InspectionPage() {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [checklist, setChecklist] = useState({});
  const [passedTeams, setPassedTeams] = useState([]);
  const [savedResults, setSavedResults] = useState({});
  const [showWarnings, setShowWarnings] = useState(false);

  const inspectionItems = [
    "ROBOT is presented with all mechanisms (I304)",
    "ROBOT has two robot signs (R401)",
    "Signs indicate alliance colors (R402)",
    "Team number displayed correctly (R403)",
    "No sharp edges or hazards (R201, R202)",
    "No distracting sound devices (R203.B)",
    "No hazardous materials (R203.D/E/G/H)",
    "No delay-of-game materials (R205)",
    "No closed air/hydraulic devices (R203.F, R207)",
    "No prohibited COTS mechanisms (R303)",
    "Battery properly secured",
    "Power switch accessible",
    "No exposed wiring hazards",
    "Driver Station present and charged",
    "Robot Controller present and charged",
    "Legal Control Hub or Smartphone used",
    "Gamepads compliant (≤2 allowed)",
    "Robot fits within sizing requirements",
    "Robot signs visible from 12 feet",
    "Team numbers legible and sized correctly"
  ];

  // 初始化 checklist
  useEffect(() => {
    const initialChecklist = {};
    inspectionItems.forEach(item => {
      initialChecklist[item] = false;
    });
    setChecklist(initialChecklist);

    // 从 localStorage 恢复保存结果
    const saved = localStorage.getItem('inspectionResults');
    if (saved) {
      setSavedResults(JSON.parse(saved));
    }
    const passed = localStorage.getItem('passedTeams');
    if (passed) {
      setPassedTeams(JSON.parse(passed));
    }
  }, []);

  // 每次保存结果时写入 localStorage
  useEffect(() => {
    localStorage.setItem('inspectionResults', JSON.stringify(savedResults));
  }, [savedResults]);

  useEffect(() => {
    localStorage.setItem('passedTeams', JSON.stringify(passedTeams));
  }, [passedTeams]);

  const toggleCheck = (item) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handleSave = () => {
    if (!selectedTeam) {
      alert("请先选择一个队伍！");
      return;
    }
    // 保存当前队伍的检查结果
    setSavedResults(prev => ({ ...prev, [selectedTeam]: checklist }));
    alert(`保存 ${selectedTeam} 的检查结果`);

    // 保存后清空选择框和 checklist
    setSelectedTeam('');
    const resetChecklist = {};
    inspectionItems.forEach(item => { resetChecklist[item] = false; });
    setChecklist(resetChecklist);
    setShowWarnings(false);
  };

  const handlePass = () => {
    const uncheckedItems = inspectionItems.filter(item => !checklist[item]);
    if (uncheckedItems.length > 0) {
      setShowWarnings(true);
      alert("还有未勾选的检查项！");
      return;
    }

    setPassedTeams(prev => [...prev, selectedTeam]);
    setSelectedTeam('');
    const resetChecklist = {};
    inspectionItems.forEach(item => { resetChecklist[item] = false; });
    setChecklist(resetChecklist);
    setShowWarnings(false);
    alert(`${selectedTeam} 已通过检查`);
  };

  const handleSelectTeam = (teamName) => {
    setSelectedTeam(teamName);
    if (savedResults[teamName]) {
      setChecklist(savedResults[teamName]); // 自动恢复保存过的结果
    } else {
      const resetChecklist = {};
      inspectionItems.forEach(item => { resetChecklist[item] = false; });
      setChecklist(resetChecklist);
    }
    setShowWarnings(false);
  };

  // ✅ 新增：清空机检结果
  const handleClearResults = () => {
    setSavedResults({});
    setPassedTeams([]);
    localStorage.removeItem('inspectionResults');
    localStorage.removeItem('passedTeams');
    alert("机检结果已清空！");
  };

  const availableTeams = teamsData.filter(team => !passedTeams.includes(team.name));

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>机检页面</h1>

      <select 
        value={selectedTeam} 
        onChange={(e) => handleSelectTeam(e.target.value)}
        style={{ fontSize: '16px', padding: '6px', marginBottom: '20px' }}
      >
        <option value="">选择队伍</option>
        {availableTeams.map(team => (
          <option key={team.id} value={team.name}>{team.name}</option>
        ))}
      </select>

      <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>检查要求</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>结果</th>
          </tr>
        </thead>
        <tbody>
          {inspectionItems.map(item => (
            <tr key={item}>
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>
                {item}
                {showWarnings && !checklist[item] && (
                  <span style={{ color: 'red', marginLeft: '8px' }}>*</span>
                )}
              </td>
              <td 
                style={{ border: '1px solid black', padding: '8px', cursor: 'pointer' }}
                onClick={() => toggleCheck(item)}
              >
                {checklist[item] ? "✔️" : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <button className="save-btn" onClick={handleSave}>Save</button>
        <button className="pass-btn" onClick={handlePass} disabled={!selectedTeam}>Pass</button>
        <button className="clear-btn" onClick={handleClearResults}>Clear</button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>已通过队伍</h3>
        <ul>
          {passedTeams.map(team => (
            <li key={team} style={{ opacity: 0.5 }}>{team}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default InspectionPage;
