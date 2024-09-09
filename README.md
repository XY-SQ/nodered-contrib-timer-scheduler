# nodered-contrib-timer-scheduler
Configure the node for the scheduled task based on the MQTT message received

## FEATURES
- Received MQTT Example

| "command" |  "name"  | "intervalTime" | "payload" |
|:---------:|:--------:|:--------------:|:---------:|
| "start" | "TimerForTemp" | "10" | "reportName":"Temp","plcInputList":[ {},{},{} ] |
| "update" | "TimerForTemp" | "70" | "reportName":"Temp","plcInputList":[ {},{},{} ] |
| "stop" | "TimerForTemp" | igenored \|\| null | igenored \|\| null |

- JSON

  Node input format for the sample
```json 
{
  "command":"Execute the command",
  "name":"The name of your task",
  "intervalTime": "Your interval",
  "payload": {
    "reportName" : "temperature",
    "plcInputList" : [
      {
        "func": "Your address read type",
        "body": {
          "name": "Your register name",
          "address": "Your register address"
        }
      }
    ]
  }
}  
```
