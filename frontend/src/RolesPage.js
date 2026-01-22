// frontend/src/RolesPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import teamsData from './data/teams.json';

function RolesPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');

  const handleConfirm = () => {
    localStorage.setItem('boundTeam', selectedTeam);
    setShowModal(false);
    navigate('/player');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>请选择您的角色</h1>
      <div>
        <button
          style={{ fontSize: '20px', margin: '20px', padding: '10px 30px' }}
          onClick={() => navigate('/score')}
        >
          我是裁判
        </button>
        <button
          style={{ fontSize: '20px', margin: '20px', padding: '10px 30px' }}
          onClick={() => navigate('/inspection')}
        >
          我是机检
        </button>
        <button
          style={{ fontSize: '20px', margin: '20px', padding: '10px 30px' }}
          onClick={() => setShowModal(true)}
        >
          我是选手
        </button>
      </div>

      {/* 队伍绑定弹窗 */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              width: '400px',
              margin: '150px auto',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <h2>绑定自己的队伍</h2>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              style={{ fontSize: '16px', padding: '6px', marginBottom: '20px' }}
            >
              <option value="">不绑定队伍</option>
              {teamsData.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
            <br />
            <button
              style={{ fontSize: '18px', padding: '10px 20px', marginTop: '20px' }}
              onClick={handleConfirm}
            >
              确认
            </button>
            <button
              style={{
                fontSize: '18px',
                padding: '10px 20px',
                marginTop: '20px',
                marginLeft: '10px',
              }}
              onClick={() => setShowModal(false)}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RolesPage;
