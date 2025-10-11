import React, { useState, useEffect } from 'react';

const CommandDisplay: React.FC = () => {
  const [command, setCommand] = useState<string>('');

  useEffect(() => {
    const isNode = Math.random() < 0.8;

    // 3. Simple logic to choose the command
    const chosenCommand = isNode
      ? 'node main.js'
      : 'deno run main.js';
      
    setCommand(chosenCommand);

  }, []); 

  return (
    <div>
      <span className="text-gray-300">
        {command}
      </span>
    </div>
  );
};

export default CommandDisplay;