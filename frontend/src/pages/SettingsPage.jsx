import React from 'react';
import {THEMES} from "../constants";
import { useThemeStore } from '../store/useThemeStore';
import { Send } from 'lucide-react';

const PREVIEW_MESSAGES = [
  {id: 1, content: "HEY! HOW'S IT GOING?", isSent: false},
  {id: 2, content: "I'M DOING GREAT, HOW ABOUT YOU?", isSent: true},
];



const SettingsPage = () => {
  const{theme, setTheme} = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button 
            key={t}
            className={`
              group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors 
              ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
          >
            <div className='relative h-8 w-full rounded-md overflow-hidden' data-theme={t}>
              <div className="absolute inset-0 grid-cols-4 gap-px p-1">
                <div className="rounded bg-primary">
                  <div className="rounded bg-secondary">
                    <div className="rounded bg-accent">
                      <div className="rounded bg-neutral">

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span className="text-[11px] font-medium truncate w-full text-center">
              {t.charAt(0).toUpperCase() + t.slice(1)}

            </span>
          </button>
          ))}
          
        </div>
        {/* Preview section */}
        <h3 className='text-lg font-semibold mb-3'>Preview</h3>
        <div className='rounded-xl border-base-300 overflow-hidden bg-base-100 shadow-lg'>
          <div className='p-4 bg-base-200'>
            <div className='max-w-lg mx-auto'>
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Cha Header */}
                <div className='px-4 py-3 border-b border-base-300 bg-base-100'>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                    J
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">John Doe</h3>
                    <p className="text-xs text-base-content/20">Online</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 min-h-[200px] overflow-y-auto bg-base-100 px-2 py-4">
                { PREVIEW_MESSAGES.map((message) =>(
                  <div
                  key={message.id}
                  className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                  >
                  <div className={`max-w-[80%] rounded-xl md:rounded-2xl p-3 shadow-md 
                  ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}`}>

                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p 
                    className={`text-[10px] mt-1.5 
                      ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                      `}
                      >
                  
                  </p>  
                  <p className="text-[10px] text-primary-content/60 italic mt-1.5">
                      12:00 PM
                    </p>                
                  </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-base-300 bg-base-100">
                <div className='flex gap-2'>
                  <input
                  type="text"
                  className="input input-bordered flex-1 text-sm h-10"
                  placeholder="Type a message...."
                  value="This is a preview"
                  readOnly
                  />
                  <button className="btn btn-primary h-10 min-h-8">
                    <Send size={18}/>

                  </button>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default SettingsPage