import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, Settings, LogOut, Smile, ArrowLeft, Edit2, Check, Camera, UserPlus, Lock } from 'lucide-react';

const ThabaraApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', phone: '', password: '', confirmPassword: '' });
  const [authError, setAuthError] = useState('');

  // User accounts storage (real app needs backend)
  const [users, setUsers] = useState([
    { id: 1, name: 'කමල්', phone: '0771234567', password: '1234', avatar: '👨', status: 'Available', bio: 'Hello from THABARA!' },
    { id: 2, name: 'නිමල්', phone: '0772234567', password: '1234', avatar: '👨‍💼', status: 'Busy', bio: 'Working...' },
    { id: 3, name: 'සුනිල්', phone: '0773234567', password: '1234', avatar: '👨‍🎓', status: 'Available', bio: 'Student life' },
    { id: 4, name: 'අනුරා', phone: '0774234567', password: '1234', avatar: '👩', status: 'Available', bio: 'Hey there!' }
  ]);

  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('contacts');
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [callActive, setCallActive] = useState(null);

  const [chats, setChats] = useState({
    '1-2': [
      { id: 1, sender: 2, text: 'කොහොමද?', time: '2:25 PM' },
      { id: 2, sender: 1, text: 'හොඳින්. ඔයා?', time: '2:27 PM' }
    ]
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, selectedContact]);

  // Login function
  const handleLogin = () => {
    setAuthError('');
    const user = users.find(u => u.phone === loginForm.phone && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setLoginForm({ phone: '', password: '' });
    } else {
      setAuthError('වැරදි phone number හෝ password!');
    }
  };

  // Signup function
  const handleSignup = () => {
    setAuthError('');
    
    if (!signupForm.name || !signupForm.phone || !signupForm.password) {
      setAuthError('සියලු fields පුරවන්න!');
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthError('Passwords එකක් නෑ!');
      return;
    }

    if (users.find(u => u.phone === signupForm.phone)) {
      setAuthError('මෙම phone number දැනටමත් භාවිතා වෙලා!');
      return;
    }

    const newUser = {
      id: users.length + 1,
      name: signupForm.name,
      phone: signupForm.phone,
      password: signupForm.password,
      avatar: '🧑',
      status: 'Available',
      bio: 'Hey there! I am using THABARA'
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setSignupForm({ name: '', phone: '', password: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setView('contacts');
    setSelectedContact(null);
  };

  const sendMessage = () => {
    if (message.trim() && selectedContact) {
      const chatKey = [currentUser.id, selectedContact.id].sort().join('-');
      const newMsg = {
        id: Date.now(),
        sender: currentUser.id,
        text: message,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      setChats(prev => ({
        ...prev,
        [chatKey]: [...(prev[chatKey] || []), newMsg]
      }));
      setMessage('');
    }
  };

  const startCall = (type) => {
    setCallActive({ type, contact: selectedContact });
    setTimeout(() => setCallActive(null), 5000);
  };

  const saveProfile = () => {
    setCurrentUser(editedProfile);
    const updatedUsers = users.map(u => u.id === editedProfile.id ? editedProfile : u);
    setUsers(updatedUsers);
    setIsEditingProfile(false);
  };

  // Login/Signup Screen
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">THABARA</h1>
              <p className="text-gray-600">ඔබේ හිතවත් chat app එක</p>
            </div>

            {authMode === 'login' ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                    placeholder="077XXXXXXX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••"
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition"
                  />
                </div>

                {authError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                    {authError}
                  </div>
                )}

                <button
                  onClick={handleLogin}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Lock size={20} />
                  Login
                </button>

                <div className="text-center">
                  <button
                    onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Account එකක් නැද්ද? Sign Up කරන්න
                  </button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Demo Accounts:</p>
                  <p className="text-xs text-gray-600">📞 0771234567 | 🔑 1234</p>
                  <p className="text-xs text-gray-600">📞 0772234567 | 🔑 1234</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign Up</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">නම</label>
                  <input
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    placeholder="ඔබේ නම"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    placeholder="077XXXXXXX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="••••••"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    placeholder="••••••"
                    onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition"
                  />
                </div>

                {authError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                    {authError}
                  </div>
                )}

                <button
                  onClick={handleSignup}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <UserPlus size={20} />
                  Sign Up
                </button>

                <div className="text-center">
                  <button
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    දැනටමත් account එකක් තියෙනවද? Login වෙන්න
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Contacts View
  const ContactsView = () => {
    const otherUsers = users.filter(u => u.id !== currentUser.id);
    
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">THABARA</h1>
            <div className="flex gap-2">
              <button onClick={() => setView('profile')} className="p-2 hover:bg-white/20 rounded-full transition">
                <Settings size={24} />
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {otherUsers.map(contact => {
            const chatKey = [currentUser.id, contact.id].sort().join('-');
            const lastMsg = chats[chatKey]?.[chats[chatKey].length - 1];
            
            return (
              <div
                key={contact.id}
                onClick={() => { setSelectedContact(contact); setView('chat'); }}
                className="flex items-center gap-3 p-4 border-b hover:bg-white/50 cursor-pointer transition backdrop-blur-sm"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-3xl shadow-lg">
                    {contact.avatar}
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                    <span className="text-xs text-gray-500">{lastMsg?.time || ''}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{lastMsg?.text || 'Start chatting...'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Chat View
  const ChatView = () => {
    const chatKey = [currentUser.id, selectedContact.id].sort().join('-');
    const currentChat = chats[chatKey] || [];

    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('contacts')} className="p-2 hover:bg-white/20 rounded-full transition">
              <ArrowLeft size={24} />
            </button>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-2xl shadow-lg">
              {selectedContact?.avatar}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{selectedContact?.name}</h2>
              <p className="text-sm text-white/80">{selectedContact?.status}</p>
            </div>
            <button onClick={() => startCall('video')} className="p-2 hover:bg-white/20 rounded-full transition">
              <Video size={22} />
            </button>
            <button onClick={() => startCall('voice')} className="p-2 hover:bg-white/20 rounded-full transition">
              <Phone size={22} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentChat.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${
                msg.sender === currentUser.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none'
              }`}>
                <p className="break-words">{msg.text}</p>
                <span className={`text-xs ${msg.sender === currentUser.id ? 'text-white/70' : 'text-gray-500'} mt-1 block`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white p-4 shadow-lg border-t">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <Smile size={24} className="text-gray-600" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition"
            />
            <button onClick={sendMessage} className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg transition transform hover:scale-105">
              <Send size={20} />
            </button>
          </div>
        </div>

        {callActive && (
          <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex flex-col items-center justify-center z-50">
            <div className="text-white text-center">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl mb-6 mx-auto shadow-2xl">
                {callActive.contact.avatar}
              </div>
              <h2 className="text-3xl font-bold mb-2">{callActive.contact.name}</h2>
              <p className="text-xl mb-8">{callActive.type === 'video' ? '📹 Video' : '📞 Voice'} Call...</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setCallActive(null)} className="px-8 py-3 bg-red-500 hover:bg-red-600 rounded-full font-semibold shadow-lg transition">
                  End Call
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Profile View
  const ProfileView = () => (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <button onClick={() => setView('contacts')} className="p-2 hover:bg-white/20 rounded-full transition">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold">Profile</h2>
          {!isEditingProfile ? (
            <button onClick={() => { setIsEditingProfile(true); setEditedProfile({ ...currentUser }); }} className="p-2 hover:bg-white/20 rounded-full transition">
              <Edit2 size={22} />
            </button>
          ) : (
            <button onClick={saveProfile} className="p-2 hover:bg-white/20 rounded-full transition">
              <Check size={22} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-6xl shadow-2xl">
                {isEditingProfile ? editedProfile.avatar : currentUser.avatar}
              </div>
              {isEditingProfile && (
                <button className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition">
                  <Camera size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none transition"
                />
              ) : (
                <p className="text-gray-800 text-lg">{currentUser.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <p className="text-gray-600">{currentUser.phone}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              {isEditingProfile ? (
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none transition"
                  rows="3"
                />
              ) : (
                <p className="text-gray-600">{currentUser.bio}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              {isEditingProfile ? (
                <select
                  value={editedProfile.status}
                  onChange={(e) => setEditedProfile({ ...editedProfile, status: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none transition"
                >
                  <option>Available</option>
                  <option>Busy</option>
                  <option>Away</option>
                </select>
              ) : (
                <p className="text-gray-600">{currentUser.status}</p>
              )}
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2">
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen">
      {view === 'contacts' && <ContactsView />}
      {view === 'chat' && <ChatView />}
      {view === 'profile' && <ProfileView />}
    </div>
  );
};

export default ThabaraApp;
