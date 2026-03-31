#!/bin/bash

# Firebase Setup Script for DataLukas
echo "🔥 Setting up Firebase for DataLukas..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Login to Firebase
echo "🔐 Logging into Firebase..."
firebase login

# Initialize Firebase project
echo "📦 Initializing Firebase project..."
firebase init --project datalukas-57788

echo ""
echo "✅ Firebase setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Create users in Firebase Auth:"
echo "   - admin@datalukas.com (admin)"
echo "   - andrade@datalukas.com (andrade)"
echo "   - leo@datalukas.com (leo)"
echo "   - rallyson@datalukas.com (rallyson)"
echo "   - william@datalukas.com (william)"
echo "   - helder@datalukas.com (helder)"
echo ""
echo "2. Deploy Firestore rules:"
echo "   firebase deploy --only firestore:rules"
echo ""
echo "3. Set custom claims for admin:"
echo "   firebase auth:set-claims admin@datalukas.com '{\"admin\":true}'"
echo ""
echo "4. Start development:"
echo "   npm run dev"