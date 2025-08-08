import { useState, useRef, useEffect } from "react";
import { PROFILE, PROJECTS, SOCIALS } from "../constants/details";
import { COMMANDS, OTHERS } from "../constants/general";
import resume from "../assets/Resume.pdf";

const Terminal = () => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  const availableCommands = {
    help: () => COMMANDS.HELP.trim(),
    date: () => new Date().toString(),
    echo: (args) => args.join(" "),
    clear: () => null,
    ls: () => `what do you want`,
    profile: () => PROFILE.DETAILS.trim(),
    languages: () => PROFILE.LANGUAGES.trim(),
    socials: () => {
      return Object.entries(SOCIALS)
        .map(([platform, url]) => `${platform}: ${url}`)
        .join("\n");
    },
    social: (args) => {
      if (args.length === 0) return "Usage: social [platform]\nTry: social fb";
      const platform = args[0].toLowerCase();
      const url = SOCIALS[platform];
      if (url) {
        window.open(url, "_blank");
        return `Opening ${platform}...`;
      } else {
        return `Unknown platform: ${platform}`;
      }
    },
    availability: () => OTHERS.AVAILABILITY,
    email: () => {
      const email = PROFILE.EMAIL;
      window.open(`mailto:${email}`, "_blank");
      return `Opening email client for: ${email}`;
    },
    projects: () => {
      return Object.values(PROJECTS)
        .map((p) => `${p.name} (${p.tech})`)
        .join("\n");
    },
    project: (args) => {
      if (args.length === 0) {
        return "Usage: project [name]\nExample: project halocheck";
      }

      const key = args.join("-").toLowerCase();
      const project = PROJECTS[key];

      if (!project) {
        return `Project not found: ${args.join(" ")}`;
      }

      return `${project.name}\nTech Stack: ${project.tech}\nDescription: ${project.description}`;
    },
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (inputValue) => {
    const [cmdRaw, ...args] = inputValue.trim().split(" ");
    const cmd = cmdRaw === "cls" ? "clear" : cmdRaw;

    if (cmd === "clear") {
      setHistory([]);
      return;
    }

    if (cmd === "resume") {
      window.open(resume, "_blank");
      setHistory([
        ...history,
        { command: inputValue, output: `Opened resume in new tab.` },
      ]);
      return;
    }

    const commandFn = availableCommands[cmd];
    let output;
    if (commandFn) {
      output = commandFn(args);
    } else {
      output = `Unknown command: ${cmd}`;
    }

    setHistory([...history, { command: inputValue, output }]);
    setCommandHistory((prev) => [...prev, inputValue]);
    setHistoryIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      const newIndex =
        historyIndex === null
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === null) return;

      const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex] || "");
    }
  };

  return (
    <div
      className="bg-black text-green-500 font-mono p-4 h-[500px] overflow-y-auto rounded-md border border-gray-800 w-[70%]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mb-2">
        {history.map((item, index) => (
          <div key={index}>
            <div className="text-green-500">
              {">"} {item.command}
            </div>
            <div className="text-gray-300 ml-4 whitespace-pre-wrap">
              {item.output}
            </div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <span>&gt; </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none text-green-500 font-mono outline-none w-full pl-2"
          autoFocus
        />
      </form>
    </div>
  );
};

export default Terminal;
