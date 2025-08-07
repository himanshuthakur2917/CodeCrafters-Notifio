'use client';

import { useState } from 'react';
import { authService } from '@/lib/appwrite';
import { Client } from 'appwrite';

export const AppwriteTest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');
    setDebugInfo(null);

    try {
      // First, test raw network connectivity
      const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
      const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
      
      setTestResult('Step 1: Testing raw network connectivity...');
      
      // Test basic fetch to the endpoint
      try {
        const response = await fetch(`${endpoint}/health`, {
          method: 'GET',
          headers: {
            'X-Appwrite-Project': projectId,
            'Content-Type': 'application/json'
          }
        });
        
        const responseText = await response.text();
        console.log('Network test response:', { status: response.status, statusText: response.statusText, body: responseText });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        setTestResult('Step 2: Network OK, testing Appwrite SDK...');
      } catch (networkError: any) {
        setTestResult(`❌ Network test failed: ${networkError.message}\n\nThis suggests:\n1. Wrong endpoint URL\n2. Network/firewall issues\n3. CORS problems\n4. Appwrite server down`);
        setDebugInfo({
          type: 'network_error',
          error: networkError,
          endpoint,
          projectId
        });
        console.error('Network test failed:', networkError);
        setLoading(false);
        return;
      }

      // Create a client and test SDK connectivity
      const client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId);

      // Test getting current user (should fail with 401 if no session)
      const user = await authService.getCurrentUser();
      setTestResult(`✅ Connection successful! Current user: ${user ? user.email : 'None'}`);
      setDebugInfo({ type: 'success', user });
      
    } catch (error: any) {
      console.error('Full error object:', error);
      console.error('Error stack:', error.stack);
      console.error('Error properties:', Object.keys(error));
      
      setDebugInfo({
        type: 'sdk_error',
        error: {
          message: error.message,
          code: error.code,
          type: error.type,
          response: error.response,
          stack: error.stack,
          name: error.name
        }
      });
      
      if (error.code === 401) {
        setTestResult('✅ Connection successful! (No active session - this is normal)');
      } else if (error.message?.toLowerCase().includes('fetch') || error.name === 'TypeError') {
        setTestResult(`❌ Network/Fetch error: ${error.message}\n\nCommon causes:\n1. CORS not configured for your domain\n2. Wrong endpoint URL\n3. Environment variables not loaded\n4. Network connectivity issues`);
      } else {
        setTestResult(`❌ SDK error: ${error.message}\n\nError details:\n- Type: ${error.type || 'unknown'}\n- Code: ${error.code || 'unknown'}\n- Name: ${error.name || 'unknown'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    setDebugInfo(null);
    const testEmail = `test+${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    const testName = 'Test User';

    try {
      setTestResult(`Creating test account: ${testEmail}`);
      const result = await authService.createAccount(testEmail, testPassword, testName);
      setTestResult('✅ Signup works! Test account created successfully.');
      setDebugInfo({ type: 'signup_success', account: result, email: testEmail });
      
      // Clean up - try to login and delete the account
      try {
        const session = await authService.login(testEmail, testPassword);
        setTestResult('✅ Both signup and login work perfectly!');
        setDebugInfo({ type: 'full_success', account: result, session, email: testEmail });
      } catch (loginError: any) {
        console.error('Login after signup failed:', loginError);
        setTestResult('✅ Signup works, but login failed. Check your settings.');
        setDebugInfo({ 
          type: 'signup_success_login_failed', 
          account: result, 
          loginError: {
            message: loginError.message,
            code: loginError.code,
            type: loginError.type
          },
          email: testEmail 
        });
      }
    } catch (error: any) {
      console.error('Full signup error object:', error);
      console.error('Signup error stack:', error.stack);
      console.error('Signup error properties:', Object.keys(error));
      
      setDebugInfo({
        type: 'signup_error',
        error: {
          message: error.message,
          code: error.code,
          type: error.type,
          response: error.response,
          stack: error.stack,
          name: error.name
        },
        email: testEmail
      });
      
      if (error.message?.toLowerCase().includes('fetch') || error.name === 'TypeError') {
        setTestResult(`❌ Network error during signup: ${error.message}\n\nSame network issues as connection test.`);
      } else if (error.code === 409) {
        setTestResult(`❌ User already exists (409)\nThis actually means the endpoint is working!\nTry the connection test instead.`);
      } else {
        setTestResult(`❌ Signup failed: ${error.message}\n\nError details:\n- Type: ${error.type || 'unknown'}\n- Code: ${error.code || 'unknown'}\n- Name: ${error.name || 'unknown'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 bg-black/90 border border-cyan-500/30 rounded-lg p-4 max-w-md">
      <h3 className="text-cyan-400 font-mono font-bold mb-2">🔧 APPWRITE DEBUG</h3>
      
      <div className="space-y-2 mb-4">
        <div className="text-xs text-cyan-300 font-mono">
          Endpoint: {process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '❌ MISSING'}
        </div>
        <div className="text-xs text-cyan-300 font-mono">
          Project: {process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '❌ MISSING'}
        </div>
        <div className="text-xs text-yellow-300 font-mono">
          Environment: {typeof window !== 'undefined' ? 'Client' : 'Server'}
        </div>
        <div className="text-xs text-yellow-300 font-mono">
          URL being tested: {process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'}/health
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={async () => {
            setLoading(true);
            setTestResult('Checking CORS configuration...');
            
            // Test if CORS is the issue by using different approaches
            const tests = [];
            
            // Test 1: Basic fetch (will fail due to CORS)
            try {
              const response = await fetch('https://cloud.appwrite.io/v1/health');
              tests.push('✅ Direct fetch works');
            } catch (error: any) {
              tests.push(`❌ Direct fetch: ${error.message}`);
            }
            
            // Test 2: With no-cors mode (should work but limited response)
            try {
              const response = await fetch('https://cloud.appwrite.io/v1/health', {
                mode: 'no-cors'
              });
              tests.push(`✅ No-CORS fetch: ${response.type} response`);
            } catch (error: any) {
              tests.push(`❌ No-CORS fetch: ${error.message}`);
            }
            
            // Check current domain
            const currentDomain = window.location.hostname;
            tests.push(``);
            tests.push(`🌐 Current domain: ${currentDomain}`);
            tests.push(`🌐 Full URL: ${window.location.href}`);
            tests.push(``);
            tests.push('📝 CORS Solution:');
            tests.push('1. In Appwrite Console → Settings → Platforms');
            tests.push('2. Add Web Platform with hostname:');
            tests.push(`   ${currentDomain}`);
            tests.push('3. Wait 5-10 minutes for propagation');
            tests.push('4. Make sure Project ID is correct');
            
            setTestResult(tests.join('\n'));
            setLoading(false);
          }}
          disabled={loading}
          className="w-full px-3 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 rounded text-sm font-mono hover:bg-orange-500/30 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test CORS Issue'}
        </button>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full px-3 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded text-sm font-mono hover:bg-blue-500/30 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={testSignup}
          disabled={loading}
          className="w-full px-3 py-2 bg-green-500/20 border border-green-500/30 text-green-300 rounded text-sm font-mono hover:bg-green-500/30 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Signup'}
        </button>
        
        <button
          onClick={async () => {
            setLoading(true);
            setDebugInfo(null);
            
            const tests = [
              { name: 'Google DNS', url: 'https://8.8.8.8/' },
              { name: 'Cloudflare', url: 'https://1.1.1.1/' },
              { name: 'GitHub', url: 'https://api.github.com/' },
              { name: 'Appwrite Health', url: 'https://cloud.appwrite.io/v1/health' }
            ];
            
            let results = [];
            let workingCount = 0;
            
            for (const test of tests) {
              try {
                console.log(`Testing ${test.name}...`);
                const response = await fetch(test.url, {
                  method: 'GET',
                  mode: 'no-cors' // This bypasses CORS for basic connectivity
                });
                results.push(`✅ ${test.name}: Reachable (${response.type})`);
                workingCount++;
              } catch (error: any) {
                results.push(`❌ ${test.name}: ${error.message}`);
                console.error(`${test.name} failed:`, error);
              }
            }
            
            // Now test Appwrite properly
            try {
              const response = await fetch('https://cloud.appwrite.io/v1/health', {
                method: 'GET'
              });
              results.push(`\n🔍 Appwrite Detailed Test:`);
              results.push(`Status: ${response.status} ${response.statusText}`);
              results.push(`Type: ${response.type}`);
              results.push(`Headers OK: ${response.headers ? 'Yes' : 'No'}`);
              
              if (response.ok) {
                const text = await response.text();
                results.push(`Response: ${text.substring(0, 100)}...`);
              }
            } catch (error: any) {
              results.push(`\n❌ Appwrite Direct Test Failed:`);
              results.push(`Error: ${error.message}`);
              results.push(`Name: ${error.name}`);
              results.push(`Stack: ${error.stack?.substring(0, 200)}...`);
            }
            
            setTestResult(`Network Diagnostics (${workingCount}/${tests.length} working):\n\n${results.join('\n')}`);
            
            setDebugInfo({
              type: 'network_diagnostics',
              workingCount,
              totalTests: tests.length,
              userAgent: navigator.userAgent,
              location: window.location.href
            });
            
            setLoading(false);
          }}
          disabled={loading}
          className="w-full px-3 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded text-sm font-mono hover:bg-purple-500/30 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Basic Network'}
        </button>
      </div>

      {testResult && (
        <div className="mt-4 p-2 bg-slate-800/50 border border-slate-600 rounded text-xs font-mono text-white whitespace-pre-line">
          {testResult}
        </div>
      )}
      
      {debugInfo && (
        <details className="mt-4">
          <summary className="text-xs text-yellow-400 cursor-pointer font-mono">🔍 Debug Details</summary>
          <div className="mt-2 p-2 bg-red-900/20 border border-red-600 rounded text-xs font-mono text-red-200 max-h-40 overflow-y-auto">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </details>
      )}
      
      {(!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) && (
        <div className="mt-4 p-2 bg-red-900/50 border border-red-500 rounded text-xs font-mono text-red-300">
          ⚠️ Missing environment variables!
        </div>
      )}
    </div>
  );
};
