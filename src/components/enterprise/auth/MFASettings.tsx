
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { QRCodeSVG } from 'qrcode.react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, Smartphone, Mail, Shield } from 'lucide-react';

export const MFASettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('app');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [secretKey] = useState<string>('ABCDEFGHIJKLMNOP');
  const [backupCodes] = useState<string[]>([
    'ABCD-EFGH-IJKL',
    'MNOP-QRST-UVWX',
    'YZAB-CDEF-GHIJ',
    'KLMN-OPQR-STUV',
    'WXYZ-ABCD-EFGH',
  ]);

  const handleVerify = () => {
    // TODO: Implement verification logic
    if (verificationCode.length === 6) {
      setIsEnabled(true);
    }
  };

  const totpUri = `otpauth://totp/AppName:user@example.com?secret=${secretKey}&issuer=AppName&algorithm=SHA1&digits=6&period=30`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Factor Authentication</CardTitle>
        <CardDescription>Secure your account with additional verification methods</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">MFA Status</h3>
              <p className="text-sm text-gray-500">Enable additional security for your account</p>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
              disabled={!isEnabled} // Can only toggle off once enabled through verification
            />
          </div>

          {isEnabled ? (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>MFA is enabled</AlertTitle>
              <AlertDescription>
                Your account is protected with multi-factor authentication.
              </AlertDescription>
            </Alert>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="app">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Authenticator App
                </TabsTrigger>
                <TabsTrigger value="sms">
                  <Mail className="h-4 w-4 mr-2" />
                  SMS
                </TabsTrigger>
                <TabsTrigger value="email">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="app" className="space-y-4 mt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">1. Scan QR Code</h3>
                    <p className="text-sm text-gray-500">
                      Scan this QR code with your authenticator app (Google Authenticator,
                      Microsoft Authenticator, Authy, etc.)
                    </p>
                    
                    <div className="bg-white p-4 rounded-lg border inline-block">
                      <QRCodeSVG value={totpUri} size={180} />
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium">Manual entry code:</p>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{secretKey}</code>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">2. Verify Code</h3>
                    <p className="text-sm text-gray-500">
                      Enter the 6-digit code from your authenticator app to verify and enable MFA
                    </p>
                    
                    <div className="space-y-2">
                      <Label htmlFor="verification_code">Verification Code</Label>
                      <Input
                        id="verification_code"
                        placeholder="123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                        maxLength={6}
                      />
                    </div>
                    
                    <Button onClick={handleVerify} disabled={verificationCode.length !== 6}>
                      Verify & Enable
                    </Button>
                    
                    <div className="pt-4">
                      <h3 className="font-medium">3. Save Backup Codes</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Store these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
                      </p>
                      
                      <div className="bg-gray-50 p-3 rounded-lg border">
                        <div className="grid grid-cols-2 gap-2">
                          {backupCodes.map((code, index) => (
                            <code key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">{code}</code>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sms" className="space-y-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                  <Info className="h-5 w-5 text-blue-500" />
                  <p className="text-sm">SMS-based MFA will be available in the next update.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="email" className="space-y-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                  <Info className="h-5 w-5 text-blue-500" />
                  <p className="text-sm">Email-based MFA will be available in the next update.</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
