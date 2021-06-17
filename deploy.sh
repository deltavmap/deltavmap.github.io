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
remote_branch='gh-pages2'
current_branch=$(git branch --show-current)


echo "==================="
echo "==== DEPLOYING ===="
echo
echo "deploying to >>> $remote_branch <<<"
echo ""

echo "GIT STASH"; gitstash $date_stamp

echo "GIT CHECKOUT MAIN"; git checkout main;

echo "GIT DELETE BRANCH $temp_local_branch"; git branch -D $temp_local_branch ;

echo "GIT CHECKOUT $temp_local_branch"; git checkout -b $temp_local_branch ;

echo "BUILD DIST"; npm run build ;

echo "CREATE VERSION.TXT"; echo "$date_stamp" > 'dist/version.txt' ;

#echo "ADDING DIST"; git add dist ;
#
#echo "GIT COMMIT"; git commit -m "build for production" --no-verify &> /dev/null ;
#
#echo "GIT PUSH SUBTREE";
#git push origin `git subtree split --prefix dist "$temp_local_branch"`:$remote_branch --force ;

echo "CD DIST";
cd dist

echo "GIT INIT";
git init
# git config credential.username deltavmap
# git config user.email deltavmap@gmail.com

echo "GIT ADD REMOTE";
git remote add origin git@github.com:deltavmap/deltavmap.github.io.git
# git push --set-upstream origin:gh-pages2 master

echo "GIT ADD ."
git add .

echo "GIT COMMIT"
git commit -am "deploy"

echo "GIT PUSH"
git push --force origin master:gh-pages2

echo "RM -RF"
rm -rf .git
cd ..

echo "RETURN TO MAIN BRANCH"; git checkout "$current_branch" ;

echo "GIT RESET HEAD"; git reset HEAD --hard ;

echo "GIT STASH APPLY"; gitstashapply "$date_stamp" ;
