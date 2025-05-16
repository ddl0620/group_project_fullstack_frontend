import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toast } from '@/helpers/toastService.js';
import useFeedback from '@/hooks/useFeedback.js';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'student',
    university: '',
    rating: {
      ui: 5,
      ux: 5,
      overall: 5,
    },
    feedback: '',
  });

  const { createFeedback } = useFeedback();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRatingChange = (category, value) => {
    setFormData({
      ...formData,
      rating: {
        ...formData.rating,
        [category]: Number.parseInt(value),
      },
    });
  };

  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value,
    });
  };

  const handleUniversityChange = (value) => {
    setFormData({
      ...formData,
      university: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.email || !formData.name || !formData.university) {
      Toast.error('Missing information', 'Please fill in all required fields');
      return;
    }

    // Validate email format
    if (!formData.email.includes('@')) {
      Toast.error('Invalid email', 'Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await createFeedback(formData);
      setIsSubmitted(true);
    } catch (error) {
      Toast.error('Submission failed', 'Please try again later');
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      email: '',
      name: '',
      role: 'student',
      university: '',
      rating: {
        ui: 5,
        ux: 5,
        overall: 5,
      },
      feedback: '',
    });
  };

  const RatingScale = ({ category, label, value }) => {
    return (
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-sm font-medium">{label}</Label>
          <span className="text-sm font-bold text-blue-600">{value}/10</span>
        </div>
        <div className="flex items-center">
          <input
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={(e) => handleRatingChange(category, e.target.value)}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto max-w-md px-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Thank You!
                </h2>
                <p className="mb-6 text-gray-600">
                  Your feedback has been submitted successfully. We appreciate
                  your time and input.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    Go Back
                  </Button>
                  <Button onClick={handleReset}>Submit Another Response</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Website Feedback
            </CardTitle>
            <CardDescription className="text-gray-600">
              We value your opinion! Please share your thoughts about our
              website to help us improve.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Personal note from team leader */}
            <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              <p className="font-medium">
                I am Khong Quoc Khanh, team leader of Group 5 in RMIT University
                in Hanoi Campus.
              </p>
              <p className="mt-2">
                We are taking the course of "Fullstack Web Development". To
                evaluate the user experience and website overall experience, I
                want to hear your feedback on your real experience with this
                demo version. Your feedback means a lot to us. Please provide
                your thoughts about our app below.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6 grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mb-6 grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    You are <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={handleRoleChange}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lecturer" id="lecturer" />
                      <Label htmlFor="lecturer">Lecturer</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    University <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.university}
                    onValueChange={handleUniversityChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rmit">RMIT</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Rate our website (1-10)
                </h3>

                <RatingScale
                  category="ui"
                  label="User Interface (Design, Layout, Visual Appeal)"
                  value={formData.rating.ui}
                />

                <RatingScale
                  category="ux"
                  label="User Experience (Ease of Use, Navigation)"
                  value={formData.rating.ux}
                />

                <RatingScale
                  category="overall"
                  label="Overall Experience"
                  value={formData.rating.overall}
                />
              </div>

              <div className="mb-6">
                <Label
                  htmlFor="feedback"
                  className="mb-2 block text-sm font-medium"
                >
                  Additional Feedback (optional)
                </Label>
                <Textarea
                  id="feedback"
                  name="feedback"
                  placeholder="Please share any additional thoughts, suggestions, or issues you encountered..."
                  rows={5}
                  value={formData.feedback}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
