
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="w-full p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/f3ab68f7-fe1d-4e83-9843-b889f75392dd.png" 
            alt="Octava Logo" 
            className="w-10 h-10" 
          />
          <span className="font-bold text-xl text-gray-900">Octava</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700" asChild>
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      </header>
      
      {/* Hero section */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-4 md:px-12 py-8 md:py-16 max-w-7xl mx-auto">
        <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Connect, Collaborate, Create Music Together
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find the perfect collaborators for your next music project. 
            Connect with producers, vocalists, instrumentalists, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/browse">Browse Musicians</Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="bg-white rounded-2xl shadow-xl p-6 relative">
            <div className="aspect-[16/9] bg-purple-100 rounded-lg mb-6 flex items-center justify-center">
              <img 
                src="/lovable-uploads/f3ab68f7-fe1d-4e83-9843-b889f75392dd.png" 
                alt="Octava Platform" 
                className="w-24 h-24 opacity-70"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full"></div>
                <div>
                  <p className="font-medium">Find talented musicians</p>
                  <p className="text-sm text-gray-500">Connect with artists who match your style</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full"></div>
                <div>
                  <p className="font-medium">Collaborate seamlessly</p>
                  <p className="text-sm text-gray-500">Work together on projects in real-time</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
                <div>
                  <p className="font-medium">Share your creations</p>
                  <p className="text-sm text-gray-500">Showcase your work to the world</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t text-center">
        <p className="text-sm text-gray-500">© 2025 Octava. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
