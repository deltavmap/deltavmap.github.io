#!/bin/bash
# npm run build &&
# git add dist &&
# git commit -m \"build for production\" --no-verify &&
# git subtree split --prefix dist -b gh-pages &&
# git push -f origin gh-pages:gh-pages &&
# git branch -D gh-pages"

# exit when any command fails
# set -e # TODO re-enable ?

function gitstash() {
  stash_name="zsh_stash_name_$1"
  git stash push -m "$stash_name"
}

function gitstashapply() {
  stash_name=$(git stash list | grep "zsh_stash_name_$1" | cut -d: -f1)
  if [ -n "$stash_name" ]
  then
    echo "applying stash $stash_name"
    git stash apply "$stash_name"
  else
    echo "no stash found"
  fi
}

date_stamp=$(date +%s)
temp_local_branch='gh-temp-branch'
remote_branch='gh-pages'
current_branch=$(git branch --show-current)


echo "==================="
echo "==== DEPLOYING ===="
echo "==================="
echo "deploying to branch >>> $remote_branch <<<"

printf "\nGIT STASH\n"
gitstash "$date_stamp"

printf "\nGIT CHECKOUT MAIN\n"
git checkout main

printf "\nGIT DELETE BRANCH $temp_local_branch\n"
git branch -D $temp_local_branch

printf "\nGIT CHECKOUT $temp_local_branch\n"
git checkout -b $temp_local_branch

printf "\nBUILD DIST\n"
npm run build

printf "\nCD DIST\n"
cd dist

printf "\nGIT INIT\n";
git init

printf "\nGIT ADD REMOTE\n"
git remote add origin git@github.com:deltavmap/deltavmap.github.io.git

printf "\nGIT ADD .\n"
git add .

printf \n"\nGIT COMMIT\n"
git commit -am "deploy"

printf "\nGIT PUSH\n"
git push --force origin "master:$remote_branch"

printf "\nRM -RF\n"
rm -rf .git
cd ..

printf "\nRETURN TO MAIN BRANCH\n"
git checkout "$current_branch"

printf "\nGIT RESET HEAD\n"
git reset HEAD --hard

printf "\nGIT STASH APPLY\n"
gitstashapply "$date_stamp"
