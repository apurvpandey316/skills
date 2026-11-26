# Responsiveness plan

The request is ambiguous; assume the immediate problem is that initial loading gives no feedback, not a measured performance regression. First show a loading state during the initial fetch, including an error with retry if it fails. This changes perceived responsiveness without optimistic writes or concurrency risks. Next measure request and rendering latency, then consider disabling duplicate submissions, updating from mutation responses, or optimistic updates with rollback and race handling if measurements justify them.
