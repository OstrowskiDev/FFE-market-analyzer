#Requires AutoHotkey v2.0

; Change shortcut below if needed, currently Ctrl+F9
^F9:: {
    Send "^{F10}"
    Sleep 100
    Send "{F12 down}p{F12 up}"
    Sleep 500
    Send "^{F10}"
    Sleep 100

    Loop 13 {
        Click
        Sleep 50
    }

    Sleep 100
    Send "^{F10}"
    Sleep 100
    Send "{F12 down}p{F12 up}"
    Sleep 500
    Send "^{F10}"
    Sleep 100

    Loop 7 {
        Click
        Sleep 50
    }

    Send "^{F10}"
    Sleep 100
    Send "{F12 down}p{F12 up}"
    Sleep 100
    Send "^{F10}"
}
