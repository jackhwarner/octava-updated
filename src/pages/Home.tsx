
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full p-5 md:p-6 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/f3ab68f7-fe1d-4e83-9843-b889f75392dd.png" 
            alt="Octava Logo" 
            className="w-10 h-10" 
          />
          <span className="font-bold text-xl text-purple-600">Octava</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-700 hover:text-gray-900">Features</a>
          <a href="#pricing" className="text-gray-700 hover:text-gray-900">Pricing</a>
          <a href="#about" className="text-gray-700 hover:text-gray-900">About Us</a>
        </nav>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto">
          Spend less time <span className="text-purple-600">networking</span> and more time <span className="text-purple-600">creating music</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Octava is the platform that connects musicians, producers, and creators to bring your musical vision to life.
        </p>
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6 rounded-full" asChild>
          <Link to="/signup">Get Started</Link>
        </Button>
        <div className="mt-14">
          <div className="bg-gray-200 rounded-md max-w-4xl mx-auto aspect-[16/9] flex items-center justify-center">
            <img 
              src="/lovable-uploads/bbc2aa1e-fc0b-471d-8bcb-dd79522521d5.png"
              alt="Platform preview" 
              className="w-full h-full object-cover rounded-md shadow-lg"
            />
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Why Choose Octava?</h2>
          
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center mb-20">
            <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">Connect with Professionals</h3>
              <p className="text-gray-600 mb-6">
                Find the perfect collaborators for your next project. Connect with producers, vocalists, 
                instrumentalists, and other music professionals around the world.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Advanced search filters to find the perfect match</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Verified professional profiles</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>In-app messaging and scheduling</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-gray-200 rounded-md aspect-video flex items-center justify-center">
              <div className="text-gray-400">Connect with Professionals Image</div>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center mb-20">
            <div className="md:w-1/2 md:pl-8 mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">Collaborate on the Cloud</h3>
              <p className="text-gray-600 mb-6">
                Work seamlessly with your team, no matter where they are. Share files, add comments, and 
                track revisions all in one place.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Real-time collaboration tools</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Version control and file history</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Feedback and approval workflows</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-gray-200 rounded-md aspect-video flex items-center justify-center">
              <div className="text-gray-400">Cloud Collaboration Image</div>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">Bring Your Project to Life</h3>
              <p className="text-gray-600 mb-6">
                Create project listings, track progress, and showcase your work to the world. 
                From concept to completion, Octava helps you manage every step of the creative process.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Project management tools</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Portfolio building and showcasing</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Distribution opportunities</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-gray-200 rounded-md aspect-video flex items-center justify-center">
              <div className="text-gray-400">Project Management Image</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing section */}
      <section id="pricing" className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 mb-16 text-center max-w-2xl mx-auto">
            Choose the plan that works for you. No hidden fees, cancel anytime.
          </p>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {/* Monthly Plan */}
            <div className="border rounded-xl shadow-sm p-8 flex flex-col max-w-sm w-full">
              <h3 className="text-xl font-bold mb-2">Monthly</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Billed monthly, cancel anytime.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Full access to all Octava features</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Unlimited project collaboration</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Cloud storage for your files</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Premium support</span>
                </li>
              </ul>
              <Button className="mt-auto bg-purple-600 hover:bg-purple-700" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
            
            {/* Annual Plan */}
            <div className="border rounded-xl shadow-sm p-8 bg-purple-50 border-purple-200 flex flex-col max-w-sm w-full relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm">
                Save 17%
              </div>
              <h3 className="text-xl font-bold mb-2">Annual</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-500">/year</span>
              </div>
              <p className="text-gray-600 mb-6">Billed annually, cancel anytime.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Full access to all Octava features</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Unlimited project collaboration</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Cloud storage for your files</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Premium support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Priority access to new features</span>
                </li>
              </ul>
              <Button className="mt-auto bg-purple-600 hover:bg-purple-700" asChild>
                <Link to="/signup">Sign Up Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Us / CTA section */}
      <section id="about" className="py-16 px-4 md:px-8 bg-purple-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Music Collaboration?</h2>
          <p className="text-lg mb-10 opacity-80 max-w-2xl mx-auto">
            Join thousands of musicians and creators who are using Octava to bring their musical projects to life.
          </p>
          <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-full" asChild>
            <Link to="/signup">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-4 md:px-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/f3ab68f7-fe1d-4e83-9843-b889f75392dd.png" 
                alt="Octava Logo" 
                className="w-8 h-8" 
              />
              <span className="font-bold text-xl text-white">Octava</span>
            </div>
            <p className="text-sm">
              Connecting musicians and creators worldwide.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-white mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">How It Works</a></li>
              <li><a href="#" className="hover:text-white">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-sm">
          <p>© 2025 Octava. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
