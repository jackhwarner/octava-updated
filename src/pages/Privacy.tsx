import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full p-5 md:p-6 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/octava-large-purple.png" 
            alt="Octava Logo" 
            className="h-10" 
          />
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-1 py-16 px-12 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Last updated: [Date to be filled]
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                This is a placeholder for the Privacy Policy content. Please add your actual privacy policy text here.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-10 px-8 md:px-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">© 2025 Octava. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
