import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import teamsData from './data/teams.json';

function BindTeamPage() {
  const [selectedTeam, setSelectedTeam] = useState('');
  const navigate = useNavigate();

  const handleConfirm = () => {
    // 将选中的队伍存到 localStorage
    localStorage.setItem('boundTeam', selectedTeam);
    navigate('/player'); // 跳转到选手页面
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>绑定自己的队伍</h2>
      <select 
        value={selectedTeam} 
        onChange={(e) => setSelectedTeam(e.target.value)}
        style={{ fontSize: '16px', padding: '6px', marginBottom: '20px' }}
      >
        <option value="">不绑定队伍</option>
        {teamsData.map(team => (
          <option key={team.id} value={team.name}>{team.name}</option>
        ))}
      </select>
      <br />
      <button 
        style={{ fontSize: '18px', padding: '10px 20px', marginTop: '20px' }}
        onClick={handleConfirm}
      >
        确认
      </button>
    </div>
  );
}

export default BindTeamPage;
