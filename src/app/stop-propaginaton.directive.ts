/* eslint-disable @typescript-eslint/no-explicit-any */
import {Directive, HostListener} from "@angular/core";
    
@Directive({
    selector: "[appStopPropagation]",
    standalone: true,
})
export class StopPropagationDirective
{
    @HostListener("click", ["$event"])
    public onClick(event: any): void
    {
        event.stopPropagation();
    }
}