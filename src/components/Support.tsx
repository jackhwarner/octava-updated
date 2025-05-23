
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageCircle, Mail, FileText } from 'lucide-react';

const Support = () => {
  const faqs = [
    {
      question: "How do I connect with other musicians?",
      answer: "Use the Browse page to search for musicians by role, genre, or location. You can filter results and send connection requests or messages directly from their profiles."
    },
    {
      question: "How do I create a new project?",
      answer: "Go to the Projects page and click 'New Project'. Fill in the details like title, description, genre, and invite collaborators. You can organize projects into folders for better management."
    },
    {
      question: "Can I upload my music to my profile?",
      answer: "Yes! Go to your Profile page, click on the Music tab, and use the 'Upload Track' button. You can add multiple tracks to showcase your work to potential collaborators."
    },
    {
      question: "How do I manage my privacy settings?",
      answer: "Visit the Settings page to control your privacy preferences, including profile visibility, message permissions, and notification settings."
    },
    {
      question: "What file formats are supported for music uploads?",
      answer: "We support MP3, WAV, FLAC, and AAC formats. Files should be under 100MB for optimal performance."
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
          <p className="text-gray-600">Get help and find answers to your questions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Help Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-4">Get instant help from our support team</p>
                <Button className="bg-purple-600 hover:bg-purple-700">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-4">Send us your questions via email</p>
                <Button variant="outline">Send Email</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-sm text-gray-600 mb-4">Browse our comprehensive guides</p>
                <Button variant="outline">View Docs</Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="account">Account Help</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Describe your issue or question..."
                    rows={5}
                  />
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Send Message
                </Button>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Other Ways to Reach Us</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>📧 support@octava.com</p>
                    <p>📞 1-800-OCTAVA-1</p>
                    <p>🕒 Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
