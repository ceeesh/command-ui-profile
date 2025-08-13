import { useState, useRef, useEffect, useCallback } from "react";
import { PROFILE, PROJECTS, SOCIALS } from "../constants/details";
import { COMMANDS, OTHERS } from "../constants/general";
import resume from "../assets/Resume.pdf";
import TetrisGame from "./TetrisGame";
import SnakeGame from "./SnakeGame";

const Terminal = () => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);
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
    // snake: () => {
    //   setCurrentGame('snake');
    //   return null;
    // },
    tetris: () => {
      setCurrentGame('tetris');
      return null;
    },
    hack: () => {
      const hexChars = "0123456789ABCDEF";
      const binaryChars = "01";

      const hackingSequences = [
        {
          type: "data",
          count: 20,
          generator: () => {
            if (Math.random() > 0.5) {
              let hex = Array.from(
                { length: 8 },
                () => hexChars[Math.floor(Math.random() * hexChars.length)]
              ).join("");

              let data = Array.from(
                { length: 16 },
                () => hexChars[Math.floor(Math.random() * hexChars.length)]
              )
                .join("")
                .match(/.{2}/g)
                .join(" ");

              return `${hex}: ${data}`;
            } else {
              return Array.from(
                { length: 64 },
                () =>
                  binaryChars[Math.floor(Math.random() * binaryChars.length)]
              )
                .join("")
                .match(/.{8}/g)
                .join(" ");
            }
          },
        },
        // Cracking phase
        {
          type: "messages",
          messages: [
            "Initiating brute force attack...",
            "Dictionary loaded: 10,000,000 entries",
            "Attempting password: admin123... FAILED",
            "Attempting password: password1... FAILED",
            "Attempting password: qwerty123... FAILED",
            "Attempting password: welcome2024... FAILED",
            "Attempting password: summer2023... FAILED",
            "Rainbow table attack initiated...",
            "Hash collision detected...",
            "Password cracked: n3v3rg0nn4g1v3y0uup",
          ],
        },
        // System infiltration
        {
          type: "messages",
          messages: [
            "Establishing reverse shell...",
            "Shell spawned on 192.168.1.100:4444",
            "Escalating privileges...",
            "Root access obtained",
            "Disabling firewall rules...",
            "Injecting payload...",
            "Backdoor installed successfully",
            "Covering tracks...",
          ],
        },
      ];

      let delay = 0;

      // Show initial command
      setHistory((prev) => [
        ...prev,
        {
          command: "hack",
          output: "Initializing attack sequence...",
          className: "text-cyan-400",
        },
      ]);

      delay += 300;

      hackingSequences.forEach((seq) => {
        if (seq.type === "data") {
          for (let i = 0; i < seq.count; i++) {
            setTimeout(() => {
              setHistory((prev) => [
                ...prev,
                {
                  command: "",
                  output: seq.generator(),
                  className: "text-green-400 font-mono text-sm",
                },
              ]);
            }, delay);
            delay += Math.random() * 100 + 50;
          }
        } else {
          seq.messages.forEach((msg) => {
            setTimeout(() => {
              setHistory((prev) => [
                ...prev,
                { command: "", output: msg, className: "text-cyan-400" },
              ]);
            }, delay);
            delay += Math.random() * 200 + 100;
          });
        }
        delay += 500;
      });

      // Final dramatic ASCII art
      const finalMessages = [
        "All systems compromised",
        "Downloading classified files...",
        "Transfer complete: 2.3GB",
        "Wiping log files...",
        "Connection terminated",
        "",
        "██████╗  ██████╗ ██████╗ ████████╗",
        "██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝",
        "██████╔╝██║   ██║██║  ██║   ██║   ",
        "██╔══██╗██║   ██║██║  ██║   ██║   ",
        "██║  ██║╚██████╔╝██████╔╝   ██║   ",
        "╚═╝  ╚═╝ ╚═════╝ ╚═════╝    ╚═╝   ",
        "",
        ">>> ACCESS GRANTED <<<",
      ];

      finalMessages.forEach((msg, idx) => {
        setTimeout(() => {
          setHistory((prev) => [
            ...prev,
            {
              command: "",
              output: msg,
              className:
                idx >= finalMessages.length - 8
                  ? "text-red-400 font-bold"
                  : "text-green-400",
            },
          ]);
        }, delay);
        delay += idx >= finalMessages.length - 8 ? 150 : 100;
      });

      return null; // Prevents default printing since we're handling output manually
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

  const handleGameExit = () => {
    setCurrentGame(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // if (currentGame === 'snake') {
  //   return (
  //     <div className="bg-black text-green-500 font-mono p-4 h-[600px] overflow-y-auto rounded-md border border-gray-800 w-[70%] flex items-center justify-center">
  //       <SnakeGame onExit={handleGameExit} />
  //     </div>
  //   );
  // }

  if (currentGame === 'tetris') {
    return (
      <div className="bg-black text-green-500 font-mono p-4 h-[600px] overflow-y-auto rounded-md border border-gray-800 w-[70%] flex items-center justify-center">
        <TetrisGame onExit={handleGameExit} />
      </div>
    );
  }

  return (
    <div
      className="bg-black text-green-500 font-mono p-4 h-[500px] overflow-y-auto rounded-md border border-gray-800 w-[70%]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mb-2">
        {history.map((item, index) => (
          <div key={index}>
            {item.command && (
              <div className="text-green-500">
                {">"} {item.command}
              </div>
            )}
            <div
              className={`ml-4 whitespace-pre-wrap ${
                item.className || "text-gray-300"
              }`}
            >
              {item.output}
            </div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <div className="flex items-center">
        <span>&gt; </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            handleKeyDown(e);
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
          className="bg-transparent border-none text-green-500 font-mono outline-none w-full pl-2"
          autoFocus
        />
      </div>
    </div>
  );
};

export default Terminal;