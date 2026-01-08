function PowerBIPage() {
  return (
    <div className="px-5 py-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-slate-900 text-center">
        Analytics Dashboard
      </h1>
      <div className="flex justify-center items-center w-full mt-5">
        <iframe
          title="power-bi"
          width="100%"
          height="600"
          src="https://app.powerbi.com/view?r=eyJrIjoiMTYyNGVjZGItNGQ1MS00MWQxLTg3NzMtOGYyY2YzMjFiYTNhIiwidCI6ImI3YmQ0NzE1LTQyMTctNDhjNy05MTllLTJlYTk3ZjU5MmZhNyJ9"
          frameBorder="0"
          allowFullScreen="true"
          className="w-full border border-slate-300 rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}

export default PowerBIPage;
