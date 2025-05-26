import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, MessageCircle, Book, HelpCircle } from 'lucide-react';
const Support = () => {
  const faqItems = [{
    question: "How do I start a new project?",
    answer: "Click the 'New Project' button on your dashboard and fill out the project details."
  }, {
    question: "How do I find collaborators?",
    answer: "Go to the Browse page and use filters to find musicians that match your needs."
  }, {
    question: "Can I work with musicians remotely?",
    answer: "Yes! Octava supports both remote and in-person collaboration."
  }, {
    question: "How do I set my availability?",
    answer: "Visit the Availability page to set when you're free to collaborate."
  }];
  return <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
          <p className="text-gray-600">Get help and find answers to common questions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contact Options */}
          

          {/* Contact Form */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Describe your issue and we'll help you out
              </CardDescription>
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
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="general">General Question</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Describe your issue or question" rows={5} />
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-purple-600" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqItems.map((item, index) => <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Support;