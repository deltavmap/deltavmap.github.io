#!/bin/bash
# npm run build &&
# git add dist &&
# git commit -m \"build for production\" --no-verify &&
# git subtree split --prefix dist -b gh-pages &&
# git push -f origin gh-pages:gh-pages &&
# git branch -D gh-pages"

# exit when any command fails
# set -e # TODO re-enable

function gitstash() {
    git stash push -m "zsh_stash_name_$1"
}

function gitstashapply() {
    git stash apply $(git stash list | grep "zsh_stash_name_$1" | cut -d: -f1)
}

date=$(date +%s)
branch='gh-temp-branch'
remote_branch='gh-branch2'
current_branch=$(git branch --show-current)


echo "==================="
echo "==== DEPLOYING ===="
echo "deploying to $branch"
echo ""

echo "GIT STASH"; # TODO gitstash $date

echo "GIT CHECKOUT $branch"; git checkout $branch

echo "GIT MERGE MAIN"; git merge main

echo "BUILD DIST"; npm run build

echo "CREATE VERSION.TXT"; echo $date > 'dist/version.txt'

echo "ADDING DIST"; git add dist

echo "GIT COMMIT"; git commit -m "build for production" --no-verify &> /dev/null

echo "GIT PUSH SUBTREE"; git subtree push --prefix dist origin $remote_branch

echo "RETURN TO MAIN BRANCH"; git checkout $current_branch

echo "GIT STASH APPLY"; gitstashapply $date
