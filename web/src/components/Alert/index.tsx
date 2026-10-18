'use client'

const severityStyles: Record<string, string> = {
    info: "border-blue-500 bg-blue-50",
    warn: "border-yellow-500 bg-yellow-50",
    success: "border-green-500 bg-green-50",
    error: "border-red-500 bg-red-50",
};

const AlertFeed = ({ alerts }: { alerts: any }) => {

    return (
        <div className={`fixed top-4 right-4 z-[9999] w-full max-w-sm space-y-2`}>

            {alerts.map((alert: any, i: number) => {
                const style = severityStyles[alert.severity] || "border-gray-200 bg-white";

                return (
                    <div
                        key={i}
                        className={`p-3 rounded-md border transition-all duration-300 ${style} }`}
                    >
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                            <span className="uppercase">{alert.severity}</span>
                        </div>

                        <p className="mt-1 text-sm">{alert.message}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default AlertFeed