import { Router, Request, Response } from 'express';
import spotifyService from '../services/spotify';

const router = Router();

/**
 * GET /api/player/search
 * Search for songs, artists, albums
 */
router.get('/search', async (req: Request, res: Response) => {
  const { q, type = 'track' } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const results = await spotifyService.search(req.user!.accessToken, q, type as string);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search' });
  }
});

/**
 * GET /api/player/playlists
 * Get user's playlists
 */
router.get('/playlists', async (req: Request, res: Response) => {
  try {
    const playlists = await spotifyService.getPlaylists(req.user!.accessToken);
    res.json(playlists);
  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

/**
 * GET /api/player/playback
 * Get current playback state
 */
router.get('/playback', async (req: Request, res: Response) => {
  try {
    const state = await spotifyService.getPlaybackState(req.user!.accessToken);
    res.json(state);
  } catch (error) {
    console.error('Get playback state error:', error);
    res.status(500).json({ error: 'Failed to fetch playback state' });
  }
});

/**
 * POST /api/player/play
 * Start playback
 */
router.post('/play', async (req: Request, res: Response) => {
  const { uris } = req.body;

  if (!uris || !Array.isArray(uris) || uris.length === 0) {
    return res.status(400).json({ error: 'Track URIs are required' });
  }

  try {
    await spotifyService.startPlayback(req.user!.accessToken, uris);
    res.json({ message: 'Playback started' });
  } catch (error) {
    console.error('Play error:', error);
    res.status(500).json({ error: 'Failed to start playback' });
  }
});

/**
 * POST /api/player/pause
 * Pause playback
 */
router.post('/pause', async (req: Request, res: Response) => {
  try {
    await spotifyService.pausePlayback(req.user!.accessToken);
    res.json({ message: 'Playback paused' });
  } catch (error) {
    console.error('Pause error:', error);
    res.status(500).json({ error: 'Failed to pause playback' });
  }
});

/**
 * GET /api/player/saved-tracks
 * Get user's saved tracks
 */
router.get('/saved-tracks', async (req: Request, res: Response) => {
  try {
    const tracks = await spotifyService.getSavedTracks(req.user!.accessToken);
    res.json(tracks);
  } catch (error) {
    console.error('Get saved tracks error:', error);
    res.status(500).json({ error: 'Failed to fetch saved tracks' });
  }
});

/**
 * GET /api/player/profile
 * Get user profile
 */
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const profile = await spotifyService.getUserProfile(req.user!.accessToken);
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
