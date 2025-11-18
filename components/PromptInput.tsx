
import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt }) => {
  return (
    <div>
      <label htmlFor="prompt" className="block text-sm font-medium text-slate-600 mb-2">
        e.g., "on a wooden table", "worn by a model in a city", etc.
      </label>
      <textarea
        id="prompt"
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
        placeholder="Describe the scene for your mockup..."
      />
    </div>
  );
};

export default PromptInput;
