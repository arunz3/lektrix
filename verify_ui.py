import time
from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/home/jules/verification/videos")
        page = context.new_page()

        print("Navigating to localhost:3000")
        page.goto("http://localhost:3000/")

        print("Waiting for Feedback & Suggestion button")
        page.get_by_role("button", name="Feedback & Suggestion", exact=True).wait_for()

        print("Clicking Feedback & Suggestion")
        page.get_by_role("button", name="Feedback & Suggestion", exact=True).click()

        print("Waiting for feedback modal to appear")
        page.wait_for_selector('text="Have a suggestion, question, or bug report? Let us know!"')

        print("Taking screenshot of the feedback modal")
        time.sleep(1) # wait for animation
        page.screenshot(path="/home/jules/verification/screenshots/feedback_modal.png")

        print("Clicking rating star")
        # Trying to click the first star, should have our aria-label now. Let's just click the 3rd one.
        page.get_by_role("button", name="Rate 3 out of 5 stars", exact=True).click()

        print("Taking screenshot of the feedback modal after rating")
        time.sleep(1)
        page.screenshot(path="/home/jules/verification/screenshots/feedback_modal_rated.png")

        print("Clicking close modal")
        page.get_by_role("button", name="Close modal", exact=True).click()

        print("Waiting for modal to close")
        time.sleep(1) # Wait for close animation

        print("Taking final screenshot")
        page.screenshot(path="/home/jules/verification/screenshots/home_page_after_close.png")

        context.close()
        browser.close()

if __name__ == "__main__":
    main()
