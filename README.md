name: Generate Snake

on:
  schedule:
    - cron: "0 */6 * * *"
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: Platane/snk@v3
        with:
          github_user_name: drakdodare
          outputs: |
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark
      - uses: actions/upload-artifact@v3
        with:
          name: github-snake
          path: dist

      - name: Push snake
        uses: crazy-max/ghaction-github-pages@v4
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
