import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { useToast } from '../hooks/use-toast';

const Settings = () => {
  const { profile, loading, updateProfile } = useProfile();
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [settings, setSettings] = useState({
    allowMessages: true,
    emailNotifications: true,
    projectUpdates: true,
    newMessages: true
  });

  useEffect(() => {
    if (profile) {
      setEmail(profile.email || '');
      setSettings({
        allowMessages: profile.allow_messages ?? true,
        emailNotifications: profile.email_notifications ?? true,
        projectUpdates: profile.project_updates ?? true,
        newMessages: profile.new_messages ?? true
      });
    }
  }, [profile]);

  const handleEmailChange = async () => {
    if (!newEmail || newEmail === email) return;

    try {
      // First, send confirmation email
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: newEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/settings`
        }
      });

      if (signInError) throw signInError;

      toast.success('Confirmation email sent to your new email address');
      setIsEmailDialogOpen(false);
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('Failed to update email. Please try again.');
    }
  };

  const handleSettingsChange = async (key: string, value: boolean) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);

      const { error } = await supabase
        .from('profiles')
        .update({
          allow_messages: newSettings.allowMessages,
          email_notifications: newSettings.emailNotifications,
          project_updates: newSettings.projectUpdates,
          new_messages: newSettings.newMessages
        })
        .eq('id', profile?.id);

      if (error) throw error;
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
      // Revert the change in UI
      setSettings(settings);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      toast.success('Password reset email sent');
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast.error('Failed to send password reset email');
    }
  };

  const handleDeleteAccount = async () => {
    if (!profile) return;
    
    setIsDeleting(true);
    try {
      // Delete user data from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(profile.id);
      if (authError) throw authError;

      // Sign out and redirect to home
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2">
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setNewEmail(e.target.value)}
                    disabled 
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEmailDialogOpen(true)}
                  >
                    Change
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Reset Password</Label>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handlePasswordReset}
                >
                  Send Password Reset Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-messages">Allow Messages</Label>
                  <p className="text-sm text-gray-500">Let other users send you messages</p>
                </div>
                <Switch 
                  id="allow-messages" 
                  checked={settings.allowMessages}
                  onCheckedChange={(checked) => handleSettingsChange('allowMessages', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingsChange('emailNotifications', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="project-updates">Project Updates</Label>
                  <p className="text-sm text-gray-500">Notifications for project changes</p>
                </div>
                <Switch 
                  id="project-updates" 
                  checked={settings.projectUpdates}
                  onCheckedChange={(checked) => handleSettingsChange('projectUpdates', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-messages">New Messages</Label>
                  <p className="text-sm text-gray-500">Get notified of new messages</p>
                </div>
                <Switch 
                  id="new-messages" 
                  checked={settings.newMessages}
                  onCheckedChange={(checked) => handleSettingsChange('newMessages', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Delete Account</h4>
                <p className="text-sm text-gray-600 mb-4">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email Change Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
            <DialogDescription>
              Enter your new email address. A confirmation email will be sent to verify the change.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-email">New Email</Label>
              <Input 
                id="new-email" 
                type="email" 
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEmailChange}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Send Confirmation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
