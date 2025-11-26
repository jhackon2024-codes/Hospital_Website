import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, X, Send, Mic, Image as ImageIcon, Video, 
  Settings, Loader2, Sparkles, MapPin, Search as SearchIcon, 
  Volume2, Play, Pause, Square, Film, Edit, Camera
} from 'lucide-react';
import Button from './Button';
import { 
  sendMessage, transcribeAudio, generateSpeech, 
  generateImage, editImage, generateVideo 
} from '../services/gemini';
import { ChatMessage, ChatSettings, Attachment, AspectRatio, ImageSize } from '../types';

// --- Components for Tools ---

const ToolPanel: React.FC<{
  type: 'image' | 'video' | 'edit' | null;
  onClose: () => void;
  onGenerate: (data: any) => void;
}> = ({ type, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [size, setSize] = useState<ImageSize>('1K');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!type) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let result;
      if (type === 'image') {
        result = await generateImage(prompt, aspectRatio, size);
        onGenerate({ type: 'image', url: result, prompt });
      } else if (type === 'video') {
        let imageData;
        if (file) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          await new Promise(resolve => reader.onload = resolve);
          imageData = {
             data: (reader.result as string).split(',')[1],
             mimeType: file.type
          };
        }
        // Force 16:9 or 9:16 for Veo
        const videoRatio = aspectRatio === '9:16' ? '9:16' : '16:9';
        const vidUrl = await generateVideo(prompt, imageData, videoRatio);
        onGenerate({ type: 'video', url: vidUrl, prompt });
      } else if (type === 'edit') {
        if (!file) throw new Error("Image required for editing");
        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise(resolve => reader.onload = resolve);
        const base64 = (reader.result as string).split(',')[1];
        result = await editImage(base64, prompt, file.type);
        onGenerate({ type: 'image', url: result, prompt });
      }
      onClose();
    } catch (e) {
      alert("Generation failed: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-white z-20 p-4 flex flex-col gap-4 animate-fade-in">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-bold capitalize">{type} Generation</h3>
        <button onClick={onClose}><X size={20} /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prompt</label>
          <textarea 
            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary-500" 
            rows={3}
            placeholder={`Describe the ${type}...`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {(type === 'edit' || type === 'video') && (
           <div>
             <label className="block text-sm font-medium mb-1">
               {type === 'edit' ? 'Source Image (Required)' : 'Reference Image (Optional)'}
             </label>
             <input 
               type="file" 
               accept="image/*"
               onChange={(e) => setFile(e.target.files?.[0] || null)}
               className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
             />
           </div>
        )}

        {type === 'image' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Size</label>
              <select 
                value={size} 
                onChange={(e) => setSize(e.target.value as ImageSize)}
                className="w-full border rounded p-2 text-sm"
              >
                <option value="1K">1K</option>
                <option value="2K">2K</option>
                <option value="4K">4K</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ratio</label>
              <select 
                value={aspectRatio} 
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full border rounded p-2 text-sm"
              >
                <option value="1:1">1:1</option>
                <option value="3:4">3:4</option>
                <option value="4:3">4:3</option>
                <option value="9:16">9:16</option>
                <option value="16:9">16:9</option>
              </select>
            </div>
          </div>
        )}

        {type === 'video' && (
          <div>
            <label className="block text-sm font-medium mb-1">Ratio</label>
            <select 
              value={aspectRatio} 
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              className="w-full border rounded p-2 text-sm"
            >
              <option value="16:9">16:9 (Landscape)</option>
              <option value="9:16">9:16 (Portrait)</option>
            </select>
          </div>
        )}
      </div>

      <Button onClick={handleSubmit} disabled={loading || !prompt} className="w-full">
        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Generate'}
      </Button>
    </div>
  );
};

// --- Main Chat Widget ---

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hello! I am the City General AI Assistant. How can I help you with your health, appointments, or medical questions today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTool, setActiveTool] = useState<'image' | 'video' | 'edit' | null>(null);
  
  // Settings State
  const [settings, setSettings] = useState<ChatSettings>({
    model: 'pro',
    enableThinking: false,
    enableSearch: true,
    enableMaps: true,
    enableAudioResponse: false,
  });

  // Attachments State
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // --- Handlers ---

  const handleSend = async () => {
    if ((!input.trim() && pendingAttachments.length === 0) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
      attachments: [...pendingAttachments]
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setPendingAttachments([]);
    setIsLoading(true);

    try {
      const response = await sendMessage(userMsg.text, userMsg.attachments, settings);
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I processed that.",
        timestamp: new Date(),
        groundingMetadata: response.groundingMetadata,
      };

      setMessages(prev => [...prev, modelMsg]);

      // TTS if enabled
      if (settings.enableAudioResponse && response.text) {
        const audioBase64 = await generateSpeech(response.text.substring(0, 500)); // limit length
        if (audioBase64) {
           const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
           audio.play();
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Sorry, I encountered an error processing your request.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      await new Promise<void>((resolve) => {
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const base64 = result.split(',')[1];
          const type = file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'audio';
          
          newAttachments.push({
            type,
            mimeType: file.type,
            data: base64,
            previewUrl: result
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
    setPendingAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          // Transcribe immediately
          setIsLoading(true);
          try {
            const text = await transcribeAudio(base64, 'audio/webm');
            setInput(prev => prev + " " + text);
          } catch (e) {
            console.error(e);
          } finally {
            setIsLoading(false);
          }
        };
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleGeneratedContent = (data: { type: string, url: string, prompt: string }) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'model',
      text: `Here is the ${data.type} you requested: "${data.prompt}"`,
      timestamp: new Date(),
      attachments: [{
        type: data.type as any,
        url: data.url,
        data: '',
        mimeType: data.type === 'video' ? 'video/mp4' : 'image/png',
        previewUrl: data.url
      }]
    }]);
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-50 focus:outline-none focus:ring-4 focus:ring-primary-300"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Main Container */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-300" />
              <h2 className="font-bold">AI Assistant</h2>
            </div>
            <button onClick={() => setShowSettings(!showSettings)} className="hover:bg-primary-700 p-1 rounded">
              <Settings size={20} />
            </button>
          </div>

          {/* Settings / Tools Overlay */}
          <ToolPanel type={activeTool} onClose={() => setActiveTool(null)} onGenerate={handleGeneratedContent} />

          {showSettings && (
            <div className="absolute inset-0 top-14 bg-gray-50 z-10 p-6 space-y-6 overflow-y-auto animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Settings</h3>
                <button onClick={() => setShowSettings(false)} className="text-gray-500"><X /></button>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Model</label>
                <div className="flex bg-white rounded-lg p-1 border">
                  {(['pro', 'flash', 'flash-lite'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setSettings(s => ({...s, model: m}))}
                      className={`flex-1 py-2 text-sm rounded capitalize ${settings.model === m ? 'bg-primary-100 text-primary-700 font-bold' : 'text-gray-600'}`}
                    >
                      {m.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="text-sm font-medium">Thinking Mode (Pro only)</span>
                  <input 
                    type="checkbox" 
                    checked={settings.enableThinking} 
                    onChange={e => setSettings(s => ({...s, enableThinking: e.target.checked}))}
                    className="w-4 h-4 text-primary-600"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="text-sm font-medium">Google Search</span>
                  <input 
                    type="checkbox" 
                    checked={settings.enableSearch} 
                    onChange={e => setSettings(s => ({...s, enableSearch: e.target.checked}))}
                    className="w-4 h-4 text-primary-600"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="text-sm font-medium">Google Maps</span>
                  <input 
                    type="checkbox" 
                    checked={settings.enableMaps} 
                    onChange={e => setSettings(s => ({...s, enableMaps: e.target.checked}))}
                    className="w-4 h-4 text-primary-600"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="text-sm font-medium">Spoken Responses</span>
                  <input 
                    type="checkbox" 
                    checked={settings.enableAudioResponse} 
                    onChange={e => setSettings(s => ({...s, enableAudioResponse: e.target.checked}))}
                    className="w-4 h-4 text-primary-600"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}>
                  {/* Attachments Display */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mb-2 space-y-2">
                      {msg.attachments.map((att, i) => (
                        <div key={i} className="rounded-lg overflow-hidden border border-white/20">
                          {att.type === 'image' && <img src={att.previewUrl} alt="attachment" className="max-w-full h-auto" />}
                          {att.type === 'video' && <video src={att.previewUrl} controls className="max-w-full h-auto" />}
                          {att.type === 'audio' && <audio src={att.previewUrl} controls className="w-full" />}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                </div>

                {/* Grounding Metadata */}
                {msg.groundingMetadata && (
                  <div className="mt-2 text-xs flex flex-wrap gap-2 max-w-[85%]">
                     {msg.groundingMetadata.groundingChunks?.map((chunk, idx) => {
                       if (chunk.web) {
                         return (
                           <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-white border px-2 py-1 rounded-full text-blue-600 hover:bg-blue-50">
                             <SearchIcon size={10} /> {chunk.web.title}
                           </a>
                         );
                       }
                       if (chunk.maps) {
                         return (
                            <a key={idx} href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-white border px-2 py-1 rounded-full text-green-600 hover:bg-green-50">
                             <MapPin size={10} /> {chunk.maps.title}
                           </a>
                         );
                       }
                       return null;
                     })}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 flex items-center gap-2">
                  <Loader2 className="animate-spin text-primary-500" size={16} />
                  <span className="text-xs text-gray-500">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Pending Attachments Bar */}
          {pendingAttachments.length > 0 && (
            <div className="px-4 py-2 bg-gray-100 border-t flex gap-2 overflow-x-auto">
              {pendingAttachments.map((att, i) => (
                <div key={i} className="relative shrink-0 w-12 h-12 bg-gray-200 rounded overflow-hidden">
                  {att.type === 'image' ? (
                    <img src={att.previewUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Film size={16} /></div>
                  )}
                  <button 
                    onClick={() => setPendingAttachments(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick Tools */}
          <div className="px-2 pt-2 bg-white flex justify-center gap-4 text-xs text-gray-500 border-t">
            <button onClick={() => setActiveTool('image')} className="flex flex-col items-center hover:text-primary-600">
               <ImageIcon size={18} />
               <span>Gen Image</span>
            </button>
            <button onClick={() => setActiveTool('video')} className="flex flex-col items-center hover:text-primary-600">
               <Film size={18} />
               <span>Gen Video</span>
            </button>
            <button onClick={() => setActiveTool('edit')} className="flex flex-col items-center hover:text-primary-600">
               <Edit size={18} />
               <span>Edit Image</span>
            </button>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white">
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                multiple 
                accept="image/*,video/*,audio/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-primary-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Attach"
              >
                <ImageIcon size={20} />
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isRecording ? "Listening..." : "Ask anything..."}
                  className="w-full bg-gray-100 border-0 rounded-full px-4 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                  disabled={isRecording}
                />
                <button 
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`absolute right-1 top-1 p-1.5 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-primary-600'}`}
                >
                  {isRecording ? <Square size={16} fill="currentColor" /> : <Mic size={18} />}
                </button>
              </div>

              <button 
                onClick={handleSend}
                disabled={(!input && pendingAttachments.length === 0) || isLoading}
                className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;