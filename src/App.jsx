import Terminal from "./components/Terminals";

function App() {
  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center gap-2 px-4">
      {/* Hint above the terminal */}
      <p className="text-sm text-gray-400 font-mono text-center">
        Type <span className="text-green-400">help</span> to see available
        commands
      </p>

      {/* Terminal component */}
      <Terminal />
    </div>
  );
}

export default App;
