
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, Phone, MessageSquare, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Support = () => {
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const { toast } = useToast();

  const handleSubmitTicket = () => {
    // In a real app, this would submit the ticket to your support system
    toast({
      title: "Support ticket submitted",
      description: "We'll get back to you within 24 hours."
    });
    setShowTicketDialog(false);
    setTicketSubject('');
    setTicketType('');
    setTicketDescription('');
  };

  const faqs = [
    {
      question: "How do I find collaborators for my project?",
      answer: "Use the Browse page to search for musicians by role, genre, instrument, experience level, and location. You can filter your search results and view profiles of potential collaborators. Once you find someone you'd like to work with, you can send them a connection request."
    },
    {
      question: "How does the availability feature work?",
      answer: "The Availability feature allows you to set times when you're free for collaboration, recording, or other music activities. Go to the Availability page, select dates on the calendar, and add your available time slots. Other users can view your availability and request sessions during those times."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription at any time. Go to Settings > Subscription and click on 'Cancel Subscription'. Your premium features will remain active until the end of your current billing period."
    },
    {
      question: "How do I share my projects with collaborators?",
      answer: "From the Projects page, open the project you want to share. Click on the 'Share' button and enter the username or email address of the collaborator you want to invite. You can also set their permission level (viewer, contributor, or admin)."
    },
    {
      question: "Is there a limit to how many projects I can create?",
      answer: "No, there's no limit to the number of projects you can create with your Octava subscription. Create as many as you need!"
    },
    {
      question: "How secure are my music files on Octava?",
      answer: "We take security seriously. All uploaded files are encrypted, and you have complete control over who can access your projects. We use industry-standard security practices to protect your intellectual property."
    },
    {
      question: "Can I use Octava for remote collaboration?",
      answer: "Absolutely! Octava is designed for both in-person and remote collaboration. You can share files, communicate, and manage projects with team members anywhere in the world."
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
        <p className="text-gray-600">Get help and find answers to your questions</p>
      </div>

      {/* Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="mx-auto bg-purple-100 rounded-full p-3 w-12 h-12 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="mt-2">Submit a Ticket</CardTitle>
            <CardDescription>Get personalized help from our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setShowTicketDialog(true)}
            >
              Create Ticket
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="mx-auto bg-purple-100 rounded-full p-3 w-12 h-12 flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="mt-2">Email Support</CardTitle>
            <CardDescription>Send us an email anytime</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="mailto:support@octava.app">
              <Button variant="outline">support@octava.app</Button>
            </a>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="mx-auto bg-purple-100 rounded-full p-3 w-12 h-12 flex items-center justify-center">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="mt-2">Phone Support</CardTitle>
            <CardDescription>Available Mon-Fri, 9AM-5PM ET</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="tel:+18885551234">
              <Button variant="outline">+1 (888) 555-1234</Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <HelpCircle className="w-6 h-6 text-purple-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Base */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Knowledge Base</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {["Getting Started", "Account & Billing", "Project Management", "Collaboration Tools", "File Management", "Privacy & Security"].map((topic) => (
            <Card key={topic} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-2">{topic}</h3>
                <p className="text-gray-500 text-sm mb-4">Learn more about {topic.toLowerCase()} on Octava</p>
                <Button variant="ghost" className="text-purple-600 p-0">View Articles</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-subject">Subject</Label>
              <Input 
                id="ticket-subject"
                placeholder="Brief description of your issue"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticket-type">Issue Type</Label>
              <Select value={ticketType} onValueChange={setTicketType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account">Account Issue</SelectItem>
                  <SelectItem value="billing">Billing Question</SelectItem>
                  <SelectItem value="technical">Technical Problem</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticket-description">Description</Label>
              <Textarea 
                id="ticket-description"
                placeholder="Please provide as much detail as possible"
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTicketDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSubmitTicket}>
              Submit Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Support;
