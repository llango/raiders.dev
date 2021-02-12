INSERT INTO session (
  theme,
  plan,
  players,
  players_allowed,
  host,
  start_time
) VALUES (
  'NPM Packages',
  '[
      {
        "name": "Setup",
        "duration": 300000
      },
      {
        "gameName": "Ambush",
        "repo": "https://github.com/UniversalDataTool/universal-data-tool"
      },
      {
        "gameName": "Help Wanted",
        "times": 2
      }
   ]',
   '{"seve", "richard", "jerry"}',
   3,
   'seve',
   '2020-10-31 15:03:25-04'
), (
  'PIP Packages',
  '[
      {
        "gameName": "Ambush",
        "repo": "https://github.com/UniversalDataTool/universal-data-tool"
      },
      {
        "gameName": "Help Wanted",
        "times": 2
      }
   ]',
   '{"seve", "richard"}',
   3,
   'seve',
   '2020-09-20 12:03:25-04'
);
