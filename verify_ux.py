from playwright.sync_api import sync_playwright
import time
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)

    # Enable video recording
    context = browser.new_context(
        record_video_dir="/home/jules/verification/videos/",
        record_video_size={"width": 1280, "height": 720}
    )

    page = context.new_page()
    page.goto('http://localhost:3000')

    # Wait for the page to load
    page.wait_for_selector('text=Feedback')

    # Open Feedback modal
    page.get_by_role('button', name='Feedback', exact=True).click()
    page.wait_for_selector('text=Contact & Feedback')

    # Take screenshot of feedback modal to check if close button is there
    page.screenshot(path='/home/jules/verification/screenshots/feedback_modal_opened.png')

    # Press Tab multiple times to verify keyboard focus is visible
    page.keyboard.press('Tab')
    time.sleep(0.5)
    page.keyboard.press('Tab')
    time.sleep(0.5)
    page.keyboard.press('Tab')
    time.sleep(0.5)
    page.screenshot(path='/home/jules/verification/screenshots/feedback_modal_tabbed.png')

    # Use the Close Feedback Modal button
    page.get_by_label('Close Feedback Modal').click()
    time.sleep(1)

    # Test Rotate PDF tool
    page.goto('http://localhost:3000/tools/rotate')
    page.wait_for_selector('text=Rotate PDF')

    # Create dummy pdf file for testing
    with open('test_dummy.pdf', 'wb') as f:
        f.write(b'%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n200\n%%EOF')

    # Upload test pdf
    page.locator('input[type="file"]').set_input_files('test_dummy.pdf')

    # Check if rotate buttons are focusable
    time.sleep(2)
    page.screenshot(path='/home/jules/verification/screenshots/rotate_tool_loaded.png')

    # Press Tab multiple times to try and focus on the rotate buttons
    for _ in range(5):
        page.keyboard.press('Tab')
        time.sleep(0.5)

    page.screenshot(path='/home/jules/verification/screenshots/rotate_tool_tabbed.png')

    # Click remove file
    page.get_by_label('Remove File').click()
    time.sleep(1)

    # Cleanup dummy file
    if os.path.exists('test_dummy.pdf'):
        os.remove('test_dummy.pdf')

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
