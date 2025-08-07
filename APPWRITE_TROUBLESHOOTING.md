# Appwrite Configuration Troubleshooting

## 🚨 "Failed to Fetch" Error Solutions

### 1. Platform Settings in Appwrite Console
Go to your Appwrite project → Settings → Platforms

**Add these platforms:**
- **Web Platform**: 
  - Name: `Notifio Web`
  - Hostname: `localhost` (for local development)
  - Hostname: `your-domain.com` (for production)
  - Enable all origins: Check this box or add `*` for testing

### 2. Environment Variables Check
Your environment variables should look like this:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID=your-collection-id
```

### 3. Database Setup Required
In your Appwrite Console:

1. **Create Database:**
   - Go to Databases
   - Click "Create Database"
   - Name: `event-reminder-db`
   - Copy the Database ID

2. **Create Collection:**
   - Inside your database, click "Create Collection"
   - Name: `events`
   - Copy the Collection ID

3. **Set Collection Attributes:**
   ```
   - userId (string, required, 255 chars)
   - name (string, required, 255 chars)
   - date (string, required, 50 chars)
   - time (string, required, 50 chars)
   - description (string, optional, 1000 chars)
   - createdAt (string, required, 100 chars)
   ```

4. **Set Permissions:**
   - **Read Access**: `user:*` (any authenticated user)
   - **Create Access**: `user:*` (any authenticated user)
   - **Update Access**: `user:*` (any authenticated user)
   - **Delete Access**: `user:*` (any authenticated user)

### 4. Network/CORS Issues
If still failing, try:
- Clear browser cache and cookies
- Try incognito/private browsing mode
- Check browser dev tools Network tab for actual error
- Ensure no ad blockers are interfering

### 5. Test Authentication
Open browser developer tools and check:
1. Network tab for failed requests
2. Console for error messages
3. Application tab → Local Storage for any stored tokens

## Quick Test Script
Add this to test your configuration:
