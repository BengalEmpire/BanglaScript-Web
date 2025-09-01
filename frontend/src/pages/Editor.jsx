import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { basicSetup, EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import * as Y from 'yjs';
import { yCollab } from 'y-codemirror.next';
import { SocketIOProvider } from 'y-socket.io';
import { useStore } from '../store';
import { ApiContext } from '../context/ApiContext';
import JsDiff from 'diff';
import io from 'socket.io-client';
import { Users, Code, Clock, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
  withCredentials: true
});

const Editor = () => {
  const { user, group, setGroup } = useStore();
  const { getMyGroup, leaveGroup, rateUser } = useContext(ApiContext);
  const [preview, setPreview] = useState('');
  const htmlRef = useRef(null);
  const cssRef = useRef(null);
  const doc = new Y.Doc();
  const provider = new SocketIOProvider(
    import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
    group?._id,
    doc,
    { autoConnect: true }
  );
  const awareness = provider.awareness;
  const htmlYText = doc.getText('html');
  const cssYText = doc.getText('css');
  const [lastHtml, setLastHtml] = useState('');
  const [lastCss, setLastCss] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [ratingUserId, setRatingUserId] = useState('');
  const [ratingScore, setRatingScore] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !group) {
      toast.error('You must be logged in and in a group to access the editor');
      navigate('/');
      return;
    }

    // Set awareness
    awareness.setLocalStateField('user', {
      name: user.username,
      color: '#ffb61e',
      avatar: user.avatar
    });

    // Initialize editors
    const htmlState = EditorState.create({
      doc: htmlYText.toString() || group.htmlCode,
      extensions: [basicSetup, html(), yCollab(htmlYText, provider.awareness)]
    });
    const htmlView = new EditorView({ state: htmlState, parent: htmlRef.current });

    const cssState = EditorState.create({
      doc: cssYText.toString() || group.cssCode,
      extensions: [basicSetup, css(), yCollab(cssYText, provider.awareness)]
    });
    const cssView = new EditorView({ state: cssState, parent: cssRef.current });

    // Update preview and history
    const handleUpdate = () => {
      const currentHtml = htmlYText.toString();
      const currentCss = cssYText.toString();
      setPreview(`<html><head><style>${currentCss}</style></head><body>${currentHtml}</body></html>`);

      const htmlDiff = JsDiff.createPatch('html', lastHtml, currentHtml);
      if (htmlDiff && htmlDiff.length > 100) {
        socket.emit('edit', { groupId: group._id, userId: user._id, diff: htmlDiff });
      }
      setLastHtml(currentHtml);
      setLastCss(currentCss);
    };

    doc.on('update', handleUpdate);

    // Update online users
    awareness.on('change', () => {
      const users = Array.from(awareness.getStates().values()).map(state => state.user);
      setOnlineUsers(users.filter(u => u && u.name));
    });

    // Fetch group updates
    const fetchGroup = async () => {
      try {
        const groupData = await getMyGroup();
        setGroup(groupData);
      } catch (error) {
        toast.error('Failed to fetch group data');
      }
    };
    fetchGroup();

    return () => {
      htmlView.destroy();
      cssView.destroy();
      provider.destroy();
      doc.off('update', handleUpdate);
    };
  }, [user, group, navigate, setGroup, getMyGroup]);

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup();
      setGroup(null);
      toast.success('Left group successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to leave group');
    }
  };

  const handleRateUser = async (e) => {
    e.preventDefault();
    if (!ratingUserId || !group.members.some(m => m._id === ratingUserId)) {
      toast.error('Please select a valid group member to rate');
      return;
    }
    try {
      await rateUser(ratingUserId, ratingScore);
      toast.success('User rated successfully');
      setRatingUserId('');
      setRatingScore(1);
    } catch (error) {
      toast.error(error.message || 'Failed to rate user');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto p-6 sm:p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            Code Editor - {group?.name || 'Group'}
          </h1>
          <button
            onClick={handleLeaveGroup}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/50 hover:bg-red-600/70 rounded-xl text-white transition-all duration-300"
            aria-label="Leave group"
          >
            <Users className="w-4 h-4" />
            Leave Group
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-gray-700/30">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">HTML Editor</h2>
                <div ref={htmlRef} className="bg-gray-900 rounded-xl border border-gray-700/50 min-h-[300px]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">CSS Editor</h2>
                <div ref={cssRef} className="bg-gray-900 rounded-xl border border-gray-700/50 min-h-[300px]" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-gray-700/30">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                Online Collaborators
              </h2>
              <div className="space-y-2">
                {onlineUsers.map((u, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: u.color }}
                    ></div>
                    <img src={u.avatar} alt={`${u.name}'s avatar`} className="w-6 h-6 rounded-full" />
                    <span className="text-gray-300">{u.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-gray-700/30">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Edit History
              </h2>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {group?.history?.slice(-5).reverse().map((edit, index) => (
                  <div key={index} className="text-sm text-gray-400">
                    <span className="font-medium text-white">
                      {group.members.find(m => m._id === edit.userId.toString())?.username || 'Unknown'}
                    </span>{' '}
                    edited at {new Date(edit.timestamp).toLocaleTimeString()}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-gray-700/30">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Rate Collaborator
              </h2>
              <form onSubmit={handleRateUser} className="space-y-4">
                <select
                  value={ratingUserId}
                  onChange={(e) => setRatingUserId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all duration-300"
                  aria-label="Select user to rate"
                >
                  <option value="">Select a user</option>
                  {group?.members
                    .filter(m => m._id !== user._id)
                    .map(m => (
                      <option key={m._id} value={m._id}>{m.username}</option>
                    ))}
                </select>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setRatingScore(score)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                        ratingScore >= score ? 'text-yellow-400' : 'text-gray-500'
                      }`}
                      aria-label={`Rate ${score} stars`}
                    >
                      <Star className="w-5 h-5" fill={ratingScore >= score ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-xl text-white transition-all duration-300"
                  aria-label="Submit rating"
                >
                  Submit Rating
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-gray-700/30">
          <h2 className="text-lg font-semibold text-white mb-4">Preview</h2>
          <iframe
            srcDoc={preview}
            className="w-full h-[500px] rounded-xl border border-gray-700/50 bg-white"
            title="Code preview"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Editor;