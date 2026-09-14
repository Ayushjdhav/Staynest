const middleware = require("../middleware");

describe("Middleware Unit Test Suite", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            isAuthenticated: jest.fn(),
            originalUrl: "/protected-path",
            session: {},
            flash: jest.fn(),
            headers: {},
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            redirect: jest.fn(),
            locals: {},
        };
        next = jest.fn();
    });

    describe("isLoggedIn Middleware", () => {
        it("should call next() if user is authenticated", () => {
            req.isAuthenticated.mockReturnValue(true);
            middleware.isLoggedIn(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.redirect).not.toHaveBeenCalled();
        });

        it("should redirect to /login and set flash if not authenticated (HTML request)", () => {
            req.isAuthenticated.mockReturnValue(false);
            middleware.isLoggedIn(req, res, next);
            expect(req.session.redirectUrl).toBe("/protected-path");
            expect(req.flash).toHaveBeenCalledWith("error", "You must be logged in to proceed!");
            expect(res.redirect).toHaveBeenCalledWith("/login");
            expect(next).not.toHaveBeenCalled();
        });

        it("should return 401 JSON response for XHR/JSON requests when unauthenticated", () => {
            req.isAuthenticated.mockReturnValue(false);
            req.xhr = true;
            middleware.isLoggedIn(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "Authentication required" });
        });
    });

    describe("saveRedirectUrl Middleware", () => {
        it("should populate res.locals.redirectUrl from req.session", () => {
            req.session.redirectUrl = "/target-page";
            middleware.saveRedirectUrl(req, res, next);
            expect(res.locals.redirectUrl).toBe("/target-page");
            expect(next).toHaveBeenCalled();
        });

        it("should call next() without error if no redirectUrl in session", () => {
            middleware.saveRedirectUrl(req, res, next);
            expect(res.locals.redirectUrl).toBeUndefined();
            expect(next).toHaveBeenCalled();
        });
    });

    describe("isHost Middleware", () => {
        it("should permit user with host role", () => {
            req.isAuthenticated.mockReturnValue(true);
            req.user = { role: "host" };
            middleware.isHost(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it("should permit user with admin role", () => {
            req.isAuthenticated.mockReturnValue(true);
            req.user = { role: "admin" };
            middleware.isHost(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it("should redirect regular user to become-a-host page", () => {
            req.isAuthenticated.mockReturnValue(true);
            req.user = { role: "user" };
            middleware.isHost(req, res, next);
            expect(res.redirect).toHaveBeenCalledWith("/host/become-a-host");
        });
    });

    describe("isAdmin Middleware", () => {
        it("should permit admin user", () => {
            req.isAuthenticated.mockReturnValue(true);
            req.user = { role: "admin" };
            middleware.isAdmin(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it("should deny non-admin host or user", () => {
            req.isAuthenticated.mockReturnValue(true);
            req.user = { role: "host" };
            middleware.isAdmin(req, res, next);
            expect(res.redirect).toHaveBeenCalledWith("/listings");
        });
    });

    describe("Validation Middlewares", () => {
        it("should validate and normalize amenities in validateListing", () => {
            req.body = {
                listing: {
                    title: "Charming Lakefront Cottage",
                    description: "Serene lakeside cottage with beautiful morning sunrise and private dock.",
                    price: 12000,
                    location: "Udaipur",
                    country: "India",
                    category: "lake",
                    propertyType: "cottage",
                    amenities: "wifi, parking, pool",
                },
            };
            middleware.validateListing(req, res, next);
            expect(Array.isArray(req.body.listing.amenities)).toBe(true);
            expect(req.body.listing.amenities).toEqual(["wifi", "parking", "pool"]);
            expect(next).toHaveBeenCalled();
        });

        it("should throw ExpressError on invalid validateListing payload", () => {
            req.body = { listing: { title: "Short" } };
            expect(() => middleware.validateListing(req, res, next)).toThrow();
        });

        it("should validate and normalize interests in validatePlannerQuery", () => {
            req.body = {
                destination: "Manali",
                days: 3,
                interests: "Mountains, Food, Hiking",
            };
            middleware.validatePlannerQuery(req, res, next);
            expect(Array.isArray(req.body.interests)).toBe(true);
            expect(req.body.interests).toEqual(["Mountains", "Food", "Hiking"]);
            expect(next).toHaveBeenCalled();
        });
    });
});
