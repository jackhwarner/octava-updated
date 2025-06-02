import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Star } from "lucide-react";
import { useMemo } from "react";

const Home = () => {
  const reviews = useMemo(() => [{
    name: "Sarah Johnson",
    role: "Producer",
    rating: 5,
    text: "Octava has completely transformed how I collaborate with artists. The platform is intuitive and the quality of connections is amazing."
  }, {
    name: "Marcus Williams",
    role: "Guitarist",
    rating: 5,
    text: "Found my dream collaborators through Octava. The project management tools make working remotely feel seamless."
  }, {
    name: "Emma Chen",
    role: "Songwriter",
    rating: 4,
    text: "Great platform for finding talented musicians. The communication tools are top-notch."
  }, {
    name: "David Kim",
    role: "Pianist",
    rating: 5,
    text: "As a classical musician, I never thought I'd find jazz collaborators so easily. Octava opened up a whole new world for me."
  }, {
    name: "Lisa Rodriguez",
    role: "Vocalist",
    rating: 5,
    text: "The quality of projects and professionals on Octava is outstanding. Highly recommend!"
  }], []);

  // Memoize the duplicated reviews array for the scroll animation
  const duplicatedReviews = useMemo(() => [...reviews, ...reviews], [reviews]);

  return <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full p-5 md:p-6 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center">
          <img alt="Octava Logo" src="/lovable-uploads/octava-large-purple.png" className="h-10 object-scale-down" />
        </div>
        <nav className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <a href="#features" className="text-gray-700 hover:text-gray-900">Features</a>
          <a href="#testimonials" className="text-gray-700 hover:text-gray-900">Testimonials</a>
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
      
      {/* Hero section - Dashboard Page Image */}
      <section className="py-24 md:py-32 px-12 md:px-16 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 max-w-4xl mx-auto">
          Spend less time <span className="text-purple-600">networking</span> and more time <span className="text-purple-600">creating music</span>
        </h1>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Octava is the platform that connects musicians, producers, and creators to bring your musical vision to life.
        </p>
        <Button size="lg" className="text-lg px-12 py-8 rounded-full" style={{
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
        boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.5), 0 8px 10px -5px rgba(217, 70, 239, 0.2)"
      }} asChild>
          <Link to="/signup">Get Started</Link>
        </Button>
        <div className="mt-16">
          <img alt="Platform preview - Dashboard Page" className="max-w-4xl mx-auto rounded-md object-scale-down" style={{
          filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15))',
          maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
        }} src="/lovable-uploads/dashboard-page.png" />
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="py-20 px-12 md:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-24 text-center">Why Choose Octava?</h2>
          
          {/* Feature 1 - Browse Page Image */}
          <div className="flex flex-col md:flex-row items-center mb-28 max-w-6xl mx-auto">
            <div className="md:w-1/2 md:pr-16 mb-8 md:mb-0">
              <h3 className="text-3xl font-bold mb-8">Connect with Professionals</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Find the perfect collaborators for your next project. Connect with producers, vocalists, 
                instrumentalists, and other music professionals around the world.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-lg">Advanced search filters to find the perfect match</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-lg">Real-time collaboration tools</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-lg">In-app messaging and scheduling</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img alt="Connect with Professionals - Browse Page" src="/lovable-uploads/browse-page.png" className="h-full rounded-md object-scale-down" />
            </div>
          </div>
          
          {/* Feature 2 - Messages Page Image */}
          <div className="flex flex-col md:flex-row-reverse items-center mb-28 max-w-6xl mx-auto">
            <div className="md:w-1/2 md:pl-16 mb-8 md:mb-0">
              <h3 className="text-3xl font-bold mb-8">Collaborate on the Cloud</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Work seamlessly with your team, no matter where they are. Share files, add comments, and 
                track revisions all in one place.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-lg">Version control and file history</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-lg">Feedback and approval workflows</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-lg">Cloud storage and sync</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img alt="Cloud Collaboration - Messages Page" src="/lovable-uploads/messages-page.png" className="h-full rounded-md object-scale-down rounded-md" />
            </div>
          </div>
          
          {/* Feature 3 - Projects Page Image */}
          <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
            <div className="md:w-1/2 md:pr-16 mb-8 md:mb-0">
              <h3 className="text-3xl font-bold mb-8">Bring Your Project to Life</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Create project listings, track progress, and showcase your work to the world. 
                From concept to completion, Octava helps you manage every step of the creative process.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-lg">Project management tools</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-lg">Portfolio building and showcasing</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-lg">Professional networking</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img alt="Project Management - Projects Page" className="h-full rounded-md object-scale-down" src="/lovable-uploads/projects-page.png" />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews section */}
      <section id="testimonials" className="py-20 px-12 md:px-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">What Our Users Say</h2>
          <div className="relative">
            <div className="flex animate-scroll space-x-8">
              {duplicatedReviews.map((review, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl min-w-[350px] max-w-[350px] flex-shrink-0">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">"{review.text}"</p>
                  <div>
                    <p className="font-medium text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing section */}
      <section id="pricing" className="py-20 px-12 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 mb-20 text-center max-w-2xl mx-auto text-lg">
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
                <Link to="/signup">Start Your 14 Day Free Trial</Link>
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
                <Link to="/signup">Start Your 14 Day Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Us section */}
      <section id="about" className="py-20 px-12 md:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-10 text-center">About Us</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg mb-6 text-gray-700">
              Octava was founded with a simple mission: to connect musicians and creators around the world. 
              We believe in the power of collaboration to create amazing music.
            </p>
            <p className="text-lg text-gray-700">
              Our team of musicians and technology enthusiasts are working every day to improve the platform 
              and help our community of creators thrive.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 px-12 md:px-16 bg-purple-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Transform Your Music Collaboration?</h2>
          <p className="text-xl mb-12 opacity-80 max-w-2xl mx-auto">
            Join thousands of musicians and creators who are using Octava to bring their musical projects to life.
          </p>
          <Button size="lg" className="text-lg px-16 py-8 rounded-full bg-white text-purple-900 hover:bg-gray-100" asChild>
            <Link to="/signup">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-8 md:px-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img alt="Octava Logo" src="/lovable-uploads/octava-large-white.png" className="h-8" />
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
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-sm">
          <p>© 2025 Octava. All rights reserved.</p>
        </div>
      </footer>
    </div>;
};
export default Home;