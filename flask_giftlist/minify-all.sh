#!/usr/bin/bash

if ! hash uglifyjs 2>/dev/null; then
    echo "'uglifyjs' command is required and was not found in \$PATH! Exiting..."
    return 127
fi

function minify() {

    jsPath=$1
    shift
    outputFile=$1
    shift

    allScripts=""
    for a in "$@"
    do
        allScripts+="$jsPath/$a "
    done

    #echo "cat \"$allScripts\" | uglifyjs -o $outputFile"
    #printf "%s\n" $allScripts
    cat $allScripts | uglifyjs -o $outputFile -
}


# ----------------------------------------------------------------------- #

jsPath="static/js"
scripts=( \
    "gifts/GiftsApp.js" \
    "gifts/services/DataProviderService.js" \
    "gifts/services/DialogsService.js" \
    "gifts/services/NotifyService.js" \
    "gifts/controllers/ClaimGiftController.js" \
    "gifts/controllers/GiftListController.js" \
    "gifts/directives/ClaimDialogDirective.js" \
    "gifts/directives/EditDialogDirective.js" \
    "gifts/directives/FieldErrorsDirective.js" \
    "gifts/directives/NotificationsDirective.js" \
    "gifts/directives/DeleteDialogDirective.js" \
    "gifts/directives/EqualToDirective.js" \
    "gifts/directives/GiftDirective.js" )
outputFile="$jsPath/scripts.min.js"

minify $jsPath $outputFile "${scripts[@]}"
