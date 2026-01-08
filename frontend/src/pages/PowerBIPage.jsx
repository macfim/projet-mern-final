import { useState } from "react";
import Loading from "../components/ui/Loading";

function PowerBIPage() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="px-5 py-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-slate-900 text-center">
        Analytics Dashboard
      </h1>
      <div className="flex justify-center items-center w-full mt-5 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <Loading message="Loading dashboard..." />
          </div>
        )}
        <iframe
          title="power-bi"
          width="100%"
          height="600"
          src="https://app.powerbi.com/view?r=eyJrIjoiMTYyNGVjZGItNGQ1MS00MWQxLTg3NzMtOGYyY2YzMjFiYTNhIiwidCI6ImI3YmQ0NzE1LTQyMTctNDhjNy05MTllLTJlYTk3ZjU5MmZhNyJ9"
          frameBorder="0"
          allowFullScreen="true"
          className="w-full border border-slate-300 rounded-lg shadow-md"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
}

export default PowerBIPage;
