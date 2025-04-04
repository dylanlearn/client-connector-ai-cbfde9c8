import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CircleAlert, Database, FunctionSquare, TableProperties } from 'lucide-react';
import { SupabaseAuditService } from '@/services/ai/supabase-audit-service';
import { DatabaseTablesSection } from '@/components/admin/supabase-audit/DatabaseTablesSection';
import { EdgeFunctionsSection } from '@/components/admin/supabase-audit/EdgeFunctionsSection';
import { ServiceHealthSection } from '@/components/admin/supabase-audit/ServiceHealthSection';
import { LoadingState } from '@/components/admin/supabase-audit/LoadingState';
