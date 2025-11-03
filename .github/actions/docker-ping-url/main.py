import time
import requests
import os


def ping_url(url, delay, max_trials):
    trials = 0
    while trials < max_trials:
        try:
            response = requests.get(url)
            if response.status_code == 200:
                return True
        except requests.ConnectionError:
            print(
                f"Website {url} is unreachable. Retrying in. {delay} seconds...")
            time.sleep(delay)
            trials += 1
        except requests.exceptions.MissingSchema:
            print(f"Invalid URL format: {url}.")
            return False
    return False


def run():
    url = os.getenv("INPUT_URL")
    delay = int(os.getenv("INPUT_DELAY"))
    max_trials = int(os.getenv("INPUT_MAX_TRIALS"))

    accessible = ping_url(url, delay, max_trials)
    file = open(os.getenv("GITHUB_OUTPUT"), 'a')
    print(f'url-reachable={accessible}', file=file)
    
    if accessible:
        print(f"Website {url} is reachable")
    else:
        raise Exception(
            f"The URL {url} is not accessible after {max_trials} trials.")


if __name__ == "__main__":
    run()
