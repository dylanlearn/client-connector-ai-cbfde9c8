
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MFAConfiguration, MFAType } from '@/types/enterprise-auth';
import { EnterpriseAuthService } from '@/services/enterprise/EnterpriseAuthService';
import { useAuth } from '@/hooks/useAuth';
import { QRCodeSVG } from 'qrcode.react';
import { Check, ClipboardCopy, Key, Mail, MessageSquare, Shield } from 'lucide-react';
import { toast } from 'sonner';

export const MFASettings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MFAType>('totp');
  const [isLoading, setIsLoading] = useState(false);
  const [mfaConfigs, setMfaConfigs] = useState<MFAConfiguration[]>([]);
  const [configData, setConfigData] = useState<{
    secret?: string;
    backupCodes?: string[];
    qrCodeUrl?: string;
  } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadMFAConfigurations();
    }
  }, [user]);

  const loadMFAConfigurations = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const configs = await EnterpriseAuthService.getUserMFAConfigurations(user.id);
      setMfaConfigs(configs);
    } catch (error) {
      console.error('Failed to load MFA configurations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableMFA = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to enable MFA');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await EnterpriseAuthService.enableMFA(user.id, activeTab);
      
      if (result) {
        // For TOTP, create otpauth URL for QR code
        let qrCodeUrl;
        if (activeTab === 'totp') {
          const appName = 'DezignSync';
          const username = user.email || user.id;
          qrCodeUrl = `otpauth://totp/${appName}:${encodeURIComponent(username)}?secret=${result.secret}&issuer=${appName}`;
        }
        
        setConfigData({
          secret: result.secret,
          backupCodes: result.backup_codes,
          qrCodeUrl
        });
        
        toast.success(`${getMFATypeLabel(activeTab)} MFA enabled`);
        loadMFAConfigurations();
      }
    } catch (error) {
      console.error('Failed to enable MFA:', error);
      toast.error('Failed to enable MFA');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getMFATypeLabel = (type: MFAType): string => {
    switch (type) {
      case 'totp': return 'Authenticator App';
      case 'sms': return 'SMS';
      case 'email': return 'Email';
      case 'push': return 'Push Notification';
      default: return 'Unknown';
    }
  };

  const getMFATypeIcon = (type: MFAType) => {
    switch (type) {
      case 'totp':
        return <Key className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'push':
        return <Shield className="h-4 w-4" />;
    }
  };

  const getCurrentMFAConfig = () => {
    return mfaConfigs.find(config => config.mfa_type === activeTab);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Factor Authentication</CardTitle>
        <CardDescription>
          Secure your account with an additional layer of protection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as MFAType)}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="totp" className="flex items-center">
              <Key className="mr-2 h-4 w-4" />
              Authenticator App
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              SMS
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="push" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Push
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            {['totp', 'sms', 'email', 'push'].map((type) => (
              <TabsContent key={type} value={type}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {getMFATypeIcon(type as MFAType)}
                      <span className="ml-2">{getMFATypeLabel(type as MFAType)} MFA</span>
                    </CardTitle>
                    <CardDescription>
                      {type === 'totp' && 'Use an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator'}
                      {type === 'sms' && 'Receive a code via SMS to your registered phone number'}
                      {type === 'email' && 'Receive a code to your registered email address'}
                      {type === 'push' && 'Receive push notifications for authentication'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {getCurrentMFAConfig()?.is_enabled ? (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                          <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="font-medium">
                          {getMFATypeLabel(type as MFAType)} MFA is enabled
                        </p>
                        <Button variant="outline" onClick={() => loadMFAConfigurations()}>
                          Refresh Status
                        </Button>
                      </div>
                    ) : configData && activeTab === type ? (
                      <div className="space-y-4">
                        {type === 'totp' && configData.qrCodeUrl && (
                          <div className="flex flex-col items-center space-y-4">
                            <div className="bg-white p-4 rounded-lg">
                              <QRCodeSVG value={configData.qrCodeUrl} size={200} />
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                              Scan this QR code with your authenticator app
                            </p>
                          </div>
                        )}
                        
                        {configData.secret && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Manual Entry Code:</p>
                            <div className="flex items-center space-x-2">
                              <code className="bg-muted p-2 rounded flex-1 font-mono text-xs">
                                {configData.secret}
                              </code>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => copyToClipboard(configData.secret!, -1)}
                              >
                                {copiedIndex === -1 ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <ClipboardCopy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {configData.backupCodes && configData.backupCodes.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Backup Codes:</p>
                            <p className="text-xs text-muted-foreground">
                              Save these backup codes in a secure location. They can be used once each if you lose access to your MFA device.
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {configData.backupCodes.map((code, index) => (
                                <div 
                                  key={index} 
                                  className="flex items-center justify-between bg-muted p-2 rounded"
                                >
                                  <code className="font-mono text-xs">{code}</code>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard(code, index)}
                                  >
                                    {copiedIndex === index ? (
                                      <Check className="h-3 w-3" />
                                    ) : (
                                      <ClipboardCopy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-4">
                        <Button onClick={handleEnableMFA} disabled={isLoading}>
                          {isLoading 
                            ? `Enabling ${getMFATypeLabel(type as MFAType)}...` 
                            : `Enable ${getMFATypeLabel(type as MFAType)} MFA`}
                        </Button>
                        <p className="text-sm text-muted-foreground text-center">
                          {type === 'totp' && 'You will need an authenticator app on your device'}
                          {type === 'sms' && 'A verified phone number is required'}
                          {type === 'email' && 'Adds a verification step via your email'}
                          {type === 'push' && 'You will need to install our mobile app'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
