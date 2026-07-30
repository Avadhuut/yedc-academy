-- Update sample video URLs to reliable local video asset
UPDATE lesson 
SET video_url = '/videos/sample.mp4'
WHERE video_url IS NOT NULL;
