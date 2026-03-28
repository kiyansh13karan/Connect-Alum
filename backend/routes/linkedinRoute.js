import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const CLIENT_ID     = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI  = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:4000/api/linkedin/callback';
const SCOPES        = 'openid profile email';

/* ── Step 1: Return the LinkedIn authorization URL ───────── */
router.get('/authorize', (req, res) => {
    if (!CLIENT_ID) {
        return res.status(500).json({
            success: false,
            message: 'LinkedIn Client ID is not configured. Please set LINKEDIN_CLIENT_ID in .env',
        });
    }
    const state = Math.random().toString(36).substring(2);
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&state=${state}`;
    res.json({ success: true, authUrl });
});

/* ── Step 2: Handle LinkedIn callback ────────────────────── */
router.get('/callback', async (req, res) => {
    const { code, error, error_description } = req.query;

    if (error) {
        return res.redirect(`http://localhost:5173/student/feed?linkedin_error=${encodeURIComponent(error_description || error)}`);
    }

    try {
        // Exchange code for access token
        const tokenRes = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            new URLSearchParams({
                grant_type:    'authorization_code',
                code,
                redirect_uri:  REDIRECT_URI,
                client_id:     CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const accessToken = tokenRes.data.access_token;

        // Fetch profile using OpenID Connect userinfo endpoint
        const profileRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const profile = profileRes.data;
        // profile fields: sub, name, given_name, family_name, picture, email, locale

        // Redirect back to frontend with profile data encoded as query params
        const profileData = encodeURIComponent(JSON.stringify({
            id:       profile.sub,
            name:     profile.name,
            firstName: profile.given_name,
            lastName:  profile.family_name,
            picture:   profile.picture,
            email:     profile.email,
        }));

        res.redirect(`http://localhost:5173/student/feed?linkedin_profile=${profileData}&linkedin_token=${accessToken}`);

    } catch (err) {
        console.error('LinkedIn OAuth error:', err.response?.data || err.message);
        res.redirect(`http://localhost:5173/student/feed?linkedin_error=${encodeURIComponent('Failed to authenticate with LinkedIn. Please try again.')}`);
    }
});

/* ── Step 3: Validate / re-fetch a stored token ─────────── */
router.get('/profile', async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).json({ success: false, message: 'Token required' });

    try {
        const profileRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const p = profileRes.data;
        res.json({
            success: true,
            profile: {
                id:        p.sub,
                name:      p.name,
                firstName: p.given_name,
                lastName:  p.family_name,
                picture:   p.picture,
                email:     p.email,
            },
        });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token invalid or expired' });
    }
});

export default router;
